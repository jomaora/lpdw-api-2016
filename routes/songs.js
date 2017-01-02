const express = require('express');
const _ = require('lodash');
const router = express.Router();
const SongService = require('../services/songService');
const APIError = require('../lib/apiError');

const songBodyVerification = (body) => {
    const attributes = _.keys(body);
    const mandatoryAttributes = ['title', 'album', 'artist'];
    const missingAttributes = _.difference(mandatoryAttributes, attributes);
    if (!missingAttributes.length) {
        return;
    }
    return missingAttributes.toString();
};

router.post('/', (req, res) => {
    const missingAttributes = songBodyVerification(req.body);
    if (!missingAttributes) {
        return SongService.create(req.body)
            .then(song => {
                res.status(201).send(song);
            })
            .catch(err => {
                res.status(500).send(err);
            })
        ;
    }

    res.status(400).send({err: missingAttributes});
});

router.get('/', (req, res) => {
    SongService.find(req.query)
        .then(songs => {
            res.status(200).send(songs);
        })
    ;
});

router.delete('/', (req, res) => {
    SongService.delete()
        .then(() => {
            res.status(204).send();
        })
        .catch(function(err) {
            res.status(500).send(err);
        })
    ;
});

router.get('/:id', (req, res, next) => {
    if (!req.accepts('text/html') && !req.accepts('application/json')) {
        return next(new APIError(406, 'Not valid type for asked resource'));
    }
    SongService.findOneByQuery({id: req.params.id})
        .then(song => {
            if (!song) {
                return next(new APIError(404, `id ${req.params.id} not found`));
            }
            if (req.accepts('text/html')) {
                return res.render('song', {song: song});
            }
            if (req.accepts('application/json')) {
                return res.status(200).send(song);
            }
        })
        .catch(err => next)
    ;
});

router.put('/:id', (req, res) => {
    SongService.updateById(req.params.id, req.body)
        .then(result => {
            res.status(201).send(result);
        })
        .catch(err => {;
            res.status(500).send(err);
        })
    ;
});

router.delete('/:id', (req, res) => {
    SongService.delete({id: req.params.id})
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            res.status(500).send(err);
        })
    ;
});

router.get('/artist/:artist', (req, res) => {
    SongService.find({ artist: { $like: `%${req.params.artist}%` } })
        .then(songs => {
            res.status(200).send(songs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
    ;
});

module.exports = router;
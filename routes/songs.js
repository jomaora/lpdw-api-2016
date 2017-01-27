const express = require('express');
const _ = require('lodash');
const router = express.Router();
const SongService = require('../services/songService');
const APIError = require('../lib/apiError');

const songBodyVerification = (req, res, next) => {
    const mandatoryAttributes = ['title', 'album', 'artist'];
    let error = null;

    const attributes = _.keys(req.body);
    if (_.some(mandatoryAttributes, key => _.isEmpty(req.body[key]))) {
        error = new APIError(400, `${mandatoryAttributes.toString()} fields are mandatory`);
    }
    if (!req.accepts('text/html') && error) {
        return next(error);
    }
    if (error) {
        req.session.err = error;
        req.session.song = req.body;
        return res.redirect('/songs/add');
    }
    next();
};

const songTransformation = (req, res, next) => {
    if (req.body.year && !_.isFinite(parseInt(req.body.year, 10))) {
        return next(new APIError(400, 'Year should be a number'));
    }
    if (req.body.bpm && !_.isFinite(parseInt(req.body.bpm, 10))) {
        return next(new APIError(400, 'BPM should be a number'));
    }
    req.body.year = (_.isEmpty(req.body.year)) ? undefined : req.body.year;
    req.body.bpm = (_.isEmpty(req.body.bpm)) ? undefined : req.body.bpm;
    next();
}

router.post('/', songBodyVerification, songTransformation, (req, res, next) => {
    return SongService.create(req.body)
        .then(song => {
            if (req.accepts('text/html')) {
                return res.redirect('/songs/' + song.id);
            }
            if (req.accepts('application/json')) {
                return res.status(201).send(song);
            }
        })
        .catch(next)
    ;
});

router.get('/', (req, res, next) => {
    SongService.find(req.query)
        .then(songs => {
            if (req.accepts('text/html')) {
              return res.render('songs', {songs: songs});
            }
            if (req.accepts('application/json')) {
              return res.status(200).send(songs);
            }
        })
        .catch(next);
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

router.get('/add', (req, res, next) => {
    const song = (req.session.song) ? req.session.song : {};
    const err = (req.session.err) ? req.session.err : null;
    if (!req.accepts('text/html')) {
        return next(new APIError(406, 'Not valid type for asked resource'));
    }
    req.session.song = null;
    req.session.err = null;
    res.render('newSong', {song, err});
});

router.get('/edit/:id', (req, res, next) => {
    const song = (req.session.song) ? req.session.song : {};
    const err = (req.session.err) ? req.session.err : null;
    if (!req.accepts('text/html')) {
        return next(new APIError(406, 'Not valid type for asked resource'));
    }
    SongService.findOneByQuery({id: req.params.id})
        .then(song => {
            if (!song) {
                return next(new APIError(404, 'No song found with id' + req.params.id));
            }
            return res.render('editSong', {song, err});
        })
        .catch(next);
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
        .catch(next)
    ;
});

router.put('/:id', songTransformation, (req, res, next) => {
    SongService.updateById(req.params.id, req.body)
        .then(result => {
            if (req.accepts('text/html')) {
                return res.redirect('/songs/' + req.params.id);
            }
            if (req.accepts('application/json')) {
                return res.status(201).send(result);
            }
        })
        .catch(next);
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
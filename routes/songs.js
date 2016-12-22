const express = require('express');
const _ = require('lodash');
const router = express.Router();
const SongService = require('../services/songService');

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

module.exports = router;
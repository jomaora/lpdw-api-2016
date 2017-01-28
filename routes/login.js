const express = require('express');
const router = express.Router();
const APIError = require('../lib/apiError');

router.get('/', (req, res) => {
    const err = (req.session.err) ? req.session.err : null;
    if (req.accepts('text/html')) {
        return res.render('login', {err});
    }
    next(new APIError(406, 'Not valid type for asked ressource'));
});

module.exports = router;
const express = require('express');
const router = express.Router();
const APIError = require('../lib/apiError');

router.get('/', (req, res) => {
    if (req.accepts('text/html')) {
        return res.render('login');
    }
    next(new APIError(406, 'Not valid type for asked ressource'));
});

module.exports = router;
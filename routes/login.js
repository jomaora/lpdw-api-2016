const express = require('express');
const router = express.Router();
const APIError = require('../lib/apiError');
const passport = require('passport');

router.get('/', (req, res) => {
    if (req.accepts('text/html')) {
        return res.render('login');
    }
    next(new APIError(406, 'Not valid type for asked ressource'));
});

router.post('/',
    passport.authenticate('local', {
        successRedirect: '/songs',
        failureRedirect: '/login'
    })
);

module.exports = router;
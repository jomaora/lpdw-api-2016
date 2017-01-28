const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const UserService = require('../services/userService');
const APIError = require('../lib/apiError');

router.get('/', (req, res, next) => {
   const err = (req.session.err) ? req.session.err : null;
   if (req.accepts('text/html')) {
    return res.render('signup', {err});
   }
   next(new APIError(406, 'Not valid type for asked ressource'));
});

const bodyVerificator = (req, res, next) => {
    if (req.body.username && req.body.password && req.body.displayName) {
       return next();
    }

    const attributes = _.keys(req.body);
    const mandatoryAttributes = ['username', 'password', 'displayName'];
    const missingAttributes = _.difference(mandatoryAttributes, attributes);
    const emptyAttributes = _.filter(mandatoryAttributes, key => _.isEmpty(req.body[key]));

    let error = null;
    if (missingAttributes.length) {
        error = new APIError(400, 'Missing mandatory data :' + missingAttributes.toString());
    }
    if (!error && emptyAttributes.length) {
        error = new APIError(400, emptyAttributes.toString() + ' should not be empty');
    }
    if (req.accepts('text/html')) {
        req.session.err = error.message;
        return res.redirect('/signup');
    }
    return next(error);
};

router.post('/', bodyVerificator, (req, res, next) => {
    if (!req.accepts('application/json') && !req.accepts('text/html')) {
        return next(new APIError(406, 'Not valid type for asked ressource'));
    }

    UserService.findOneByQuery({username: req.body.username})
     .then(user => {
        if (user) {
            return Promise.reject(new APIError(409, 'Existing user'));
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        req.body.password = hash;
        return UserService.createUser(req.body);
     })
     .then(user => {
        if (req.accepts('text/html')) {
            return res.render('registered', {user: _.omit(user.dataValues, 'password')});
        }
        return res.status(200).send(_.omit(user.dataValues, 'password'));
     })
     .catch(error => {
        if (req.accepts('text/html')) {
            req.session.err = error.message;
            return res.redirect('/signup');
        } else {
            return next(error);
        }
     });
});

module.exports = router;
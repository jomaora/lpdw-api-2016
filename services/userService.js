'use strict'
const db = require('../database');

exports.findOneByQuery = query => {
    return db.Users.findOne({
       where: query
    });
};

exports.createUser = user => {
    const model = db.Users.build(user);
    return model.validate()
        .then(err => {
            if (err) {
                return Promise.reject(err);
            }
            return model.save();
        })
    ;
};
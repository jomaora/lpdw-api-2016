'use strict'
const db = require('../database');

exports.find = (query = {}) => {
    return db.Songs.findAll({
        where: query
    });
};

exports.create = song => {
    const model = db.Songs.build(song);
    return model.validate()
        .then(err => {
            if (err) {
                return Promise.reject(err);
            }
            return model.save();
        })
    ;
};

exports.findOneByQuery = query => {
    return db.Songs.findOne({ where: query });
};

exports.delete = (query = {}) => {
    return db.Songs.destroy({
        where: query
    });
};

exports.updateById = (id, dataToUpdate) => {
    return db.Songs.update(dataToUpdate, { where: { id }, returning: true });
};
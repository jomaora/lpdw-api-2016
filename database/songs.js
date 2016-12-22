'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Songs', {
        title: {
        	type: DataTypes.STRING,
        	validate: {notEmpty: {msg: "-> Missing title"}}
        },
        album: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "-> Missing title"}}
        },
        artist: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "-> Missing title"}}
        },
        year: {
            type: DataTypes.INTEGER
        },
        bmp: {
            type: DataTypes.INTEGER
        }
    });
};
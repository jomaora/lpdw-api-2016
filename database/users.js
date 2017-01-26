'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Users', {
        username: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "-> Missing username"}}
        },
        password: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "-> Missing password"}}
        },
        displayName: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "-> Missing displayName"}}
        }
    });
};
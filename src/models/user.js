"use strict";

// Libraries
const moment = require('moment-timezone')
moment.locale('fr')

// Module
module.exports = function(sequelize,DataTypes) {

    const User = sequelize.define('User', {
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });

    User.associate = function (models) {
        
    }

    return User
}
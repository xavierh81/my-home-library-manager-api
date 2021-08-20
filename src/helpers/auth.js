// Imports
const jwt = require("jsonwebtoken");

// Models
const models = require('@models')

// Load configuration
var env       = process.env.SERVER_ENV || "local";
var config    = require('@config/config')[env];

// Generate an access token for a user
module.exports.generateAccessToken = (user) => {
    return jwt.sign({ sub: user.id }, config.auth.server_secret_key, {expiresIn: config.auth.access_token_expiration})
}

// Extract token from header
module.exports.getAuthTokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }

    return null;
}

// Retrieve user from token
module.exports.getUserFromToken = (tokenData) => {
    return new Promise((resolve, reject) => {
        models.User.findOne({where: {id: tokenData.sub}}).then(user => {
            if (user) {
                resolve(user)
            } else {
                resolve(null)
            }
        })
    })
  }
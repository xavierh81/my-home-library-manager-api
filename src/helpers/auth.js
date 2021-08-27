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
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') 
    { 
        var token = req.headers.authorization.split(' ')[1];
        // Try to decode the auth Token and verify his validity
        try {
            const decoded = jwt.verify(token, config.auth.server_secret_key);

            // If we arrive here, then the auth token is valid and we should proceed
            return token
        }
        catch {}
    }

    // If we arrive here, the auth token is not supplied or not valid
    return null;
}

// Retrieve user from token
module.exports.getUserFromToken = (tokenData) => {
    console.log("[getUserFromToken] Start")
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
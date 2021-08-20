// Imports
const {GraphQLNonNull, GraphQLString} = require('graphql')
const {resolver} = require('graphql-sequelize');
const crypto = require('crypto')

// Models
const models = require('@models')

// GraphQL Types
const {userType} = require('@defs_graphql/types/usersTypes')

// Helpers 
const {isStringEmpty, isValidEmail} = require('@helpers/string')
const {generateAccessToken} = require('@helpers/auth')

// Configuration
var env       = process.env.SERVER_ENV || "local";
var config    = require('@config/config')[env];

// Custom errors
const { InvalidCredentialsError, MissingRequiredParameter, InvalidMailFormatError } = require('@defs_graphql/errors')

// Define core object
const usersMutations = {}

// Login with user credentials
usersMutations.login = {
    type: userType,
    args: {
        mail: {
            description: "User's email address",
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            description: "User's password",
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async function (root, {mail, password}, context, info) {
        try {
            // Check if required parameters are all set
            if(isStringEmpty(mail) || isStringEmpty(password)){
                throw new MissingRequiredParameter();
            }

            // Validate the email
            if(!isValidEmail(mail)) {
                throw new InvalidMailFormatError()
            }

            // Try to retrieve the user with these credentials
            let hashed_password = crypto.createHash('md5').update(password).digest("hex");
            let user = await models.User.findOne({where: {mail:mail.toLowerCase(),password: hashed_password}})

            if(!user) {
                throw new InvalidCredentialsError()
            }   

            // Return the user after generate a new access token
            return await resolver(models.User, {
                before: (findOptions, args, context) => {
                  findOptions.where = {id: user.id}
                  return findOptions
                },
                after: (result, args, context) => {
                  result.accessToken = generateAccessToken(result);

                  context.res.cookie('refreshToken',user.refreshToken, {httpOnly: true, secure: config.use_secured_cookies, signed: true})

                  return result;
                }
            })(root, {}, context, info);
            
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

// Export module
module.exports.usersMutations = usersMutations;
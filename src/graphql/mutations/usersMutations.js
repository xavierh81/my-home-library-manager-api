// Imports
const {GraphQLNonNull, GraphQLString} = require('graphql')
const {resolver} = require('graphql-sequelize');
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid');

// Models
const models = require('@models')

// GraphQL Types
const {userType} = require('@defs_graphql/types/usersTypes')

// Helpers 
const {isStringEmpty, isValidEmail, isValidString} = require('@helpers/string')
const {generateAccessToken} = require('@helpers/auth')

// Configuration
var env       = process.env.SERVER_ENV || "local";
var config    = require('@config/config')[env];

// Custom errors
const { 
    InvalidCredentialsError, 
    MissingRequiredParameter, 
    InvalidMailFormatError, 
    InvalidCharacterError,
    UserMailAlreadyUsedError 
} = require('@defs_graphql/errors')

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

                  if(context.res !== undefined) 
                  {
                    console.log("Set refreshToken cookie in response");
                    context.res.cookie('mhlm_refreshToken',user.refreshToken, {httpOnly: true, secure: config.use_secured_cookies, signed: true})
                  }

                  return result;
                }
            })(root, {}, context, info);
            
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

// Register: user creation
usersMutations.register = {
    type: userType,
    args: {
        firstName: {
            description: "User's firstName",
            type: new GraphQLNonNull(GraphQLString)
        },
        lastName: {
            description: "User's lastName",
            type: new GraphQLNonNull(GraphQLString)
        },
        mail: {
            description: "User's email address",
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            description: "User's password",
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async function (root, {firstName, lastName, mail, password}, context, info) {
        try {
            // Check if required parameters are all set
            if(isStringEmpty(firstName) || isStringEmpty(lastName) || isStringEmpty(mail) || isStringEmpty(password)){
                throw new MissingRequiredParameter();
            }

            // Validate firstName / Lastname
            if(!isValidString(firstName) || !isValidString(lastName)) {
                throw new InvalidCharacterError()
            }

            // Validate the email
            const userMail = mail.toLowerCase().trim()
            if(!isValidEmail(userMail)) {
                throw new InvalidMailFormatError()
            }

            // Check if user already exists
            let user = await models.User.findOne({where: {mail: userMail}})
            if(user != null)
            {
                throw new UserMailAlreadyUsedError()
            }

            // Hash the password
            let hashed_password = crypto.createHash('md5').update(password).digest("hex");
            
            // Create the user
            user = await models.User.create({
                firstName,
                lastName,
                mail: userMail,
                password: hashed_password,
                refreshToken: uuidv4()
            })
            
            // Return the user after generate a new access token
            return await resolver(models.User, {
                before: (findOptions, args, context) => {
                    findOptions.where = {id: user.id}
                    return findOptions
                },
                after: (result, args, context) => {
                    result.id = user.id
                    result.accessToken = generateAccessToken(result);
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
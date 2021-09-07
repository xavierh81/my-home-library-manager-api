// Imports
const {GraphQLNonNull, GraphQLString} = require('graphql')
const {resolver} = require('graphql-sequelize');
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid');

// Models
const { User } = require('@models')

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
    MissingRequiredParameterError, 
    InvalidMailFormatError, 
    InvalidCharacterError,
    UserMailAlreadyUsedError,
    UserNotAllowedError
} = require('@defs_graphql/errors');

// Define core object
const usersMutations : any = {}

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
    resolve: async function (root: any, {mail, password}: any, context: any, info: any) {
        try {
            // Check if required parameters are all set
            if(isStringEmpty(mail) || isStringEmpty(password)){
                throw new MissingRequiredParameterError();
            }

            // Validate the email
            if(!isValidEmail(mail)) {
                throw new InvalidMailFormatError()
            }

            // Try to retrieve the user with these credentials
            let hashed_password = crypto.createHash('md5').update(password).digest("hex");
            let user = await User.findOne({where: {mail:mail.toLowerCase(),password: hashed_password}})

            if(!user) {
                throw new InvalidCredentialsError()
            }   

            // Return the user after generate a new access token
            return await resolver(User, {
                before: (findOptions: any, args: any, context: any) => {
                  findOptions.where = {id: user.id}
                  return findOptions
                },
                after: (result: any, args: any, context: any) => {
                  result.accessToken = generateAccessToken(result);

                  if(context.res !== undefined) 
                  {
                    context.res.cookie(config.refreshToken_cookie_name, user.refreshToken, {httpOnly: true, secure: config.use_secured_cookies, signed: true})
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
    resolve: async function (root: any, {firstName, lastName, mail, password}: any, context: any, info: any) {
        try {
            // Check if required parameters are all set
            if(isStringEmpty(firstName) || isStringEmpty(lastName) || isStringEmpty(mail) || isStringEmpty(password)){
                throw new MissingRequiredParameterError();
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
            let user = await User.findOne({where: {mail: userMail}})
            if(user != null)
            {
                throw new UserMailAlreadyUsedError()
            }

            // Hash the password
            let hashed_password = crypto.createHash('md5').update(password).digest("hex");
            
            // Create the user
            user = await User.create({
                firstName,
                lastName,
                mail: userMail,
                password: hashed_password,
                refreshToken: uuidv4()
            })
            
            // Return the user after generate a new access token
            return await resolver(User, {
                before: (findOptions: any, args: any, context: any) => {
                    findOptions.where = {id: user.id}
                    return findOptions
                },
                after: (result: any, args: any, context: any) => {
                    result.id = user.id
                    result.accessToken = generateAccessToken(result);

                    if(context.res !== undefined) 
                    {
                      context.res.cookie(config.refreshToken_cookie_name, user.refreshToken, {httpOnly: true, secure: config.use_secured_cookies, signed: true})
                    }

                    return result;
                }
            })(root, {}, context, info);
            
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

// Endpoint to refresh an access token
usersMutations.refreshAccessToken = {
    type: userType,
    args: {
        refreshToken: {
            description: "User's refresh token",
            type: GraphQLString
        }
    },
    resolve: async function (root: any, {refreshToken}: any, context: any, info: any) {
        try {
            // Validate input
            if(refreshToken == null) {
                refreshToken = context.refreshToken
            }
    
            if(isStringEmpty(refreshToken)) {
                throw new MissingRequiredParameterError()
            }

            // Try to find a user matching this refreshToken
            let user = await User.findOne({where: {refreshToken: refreshToken}})
            if(!user){
                throw new UserNotAllowedError()
            }

            // Return the user after generate a new access token
            return await resolver(User, {
                before: (findOptions: any, args: any, context: any) => {
                    findOptions.where = {id: user.id}
                    return findOptions
                },
                after: (result: any, args: any, context: any) => {
                    result.accessToken = generateAccessToken(result);

                    return result;
                }
            })(root, {}, context, info);

        } catch (err) {
            return Promise.reject(err);
        }
    }
}

// Update the profile of logged user
usersMutations.updateUser = {
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
    },
    resolve: async function (root: any, {firstName, lastName, mail}: any, context: any, info: any) {
        // Check if the user is authenticated
        if(context.user == null) {
            throw new UserNotAllowedError()
        }

        // Check if required parameters are all set
        if(isStringEmpty(firstName) || isStringEmpty(lastName) || isStringEmpty(mail)){
            throw new MissingRequiredParameterError();
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

        // If the mail has changed, make an additional validation
        if(context.user.mail != userMail)
        {
            // Check if another user is already using the same mail
            // If it's the case, then we fire an error
            const existingUser = await User.findOne({where: { mail: userMail}});
            if(existingUser != null)
            {
                throw new UserMailAlreadyUsedError()
            }
        }

        // If we arrive here, we can update the user
        const newAttributes = {
            mail: userMail,
            firstName,
            lastName
        }

        await User.update(newAttributes, {where: {id: context.user.id}})
        
        // Return updated user
        return await resolver(User,{
            before: (findOptions: any, args: any, context: any) => {
              findOptions.where = {id: context.user.id}
              return findOptions
            }
        })(root, {}, context, info);
    }
}

// Export module
export default usersMutations;
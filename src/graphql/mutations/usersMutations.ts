// Imports
import {GraphQLNonNull, GraphQLResolveInfo, GraphQLString} from 'graphql'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid';

// Models
import { User } from '@models'

// GraphQL Types
import {userType} from '@defs_graphql/types/usersTypes'
import { QueryContext } from '@interfaces/queryContext';
import { GraphQLResolver } from '@interfaces/GraphQLResolver';

// Helpers 
import {isStringEmpty, isValidEmail, isValidString} from '@helpers/string'
import {generateAccessToken} from '@helpers/auth'
import {loadConfig} from '@helpers/global'

// Configuration
const config = loadConfig();

// Custom errors
import { 
    InvalidCredentialsError, 
    MissingRequiredParameterError, 
    InvalidMailFormatError, 
    InvalidCharacterError,
    UserMailAlreadyUsedError,
    UserNotAllowedError
} from '@defs_graphql/errors'

// Define core object
const usersMutations : Record<string, GraphQLResolver> = {}

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
    resolve: async function (root: unknown, {mail, password}: Record<string, string | null>, context: QueryContext, _info: GraphQLResolveInfo) {
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
            const hashed_password = crypto.createHash('md5').update(`${password}`).digest("hex");
            const userMail = mail?.toLowerCase()
            const user = await User.findOne({where: {mail:userMail, password: hashed_password}})

            if(user == null) {
                throw new InvalidCredentialsError()
            }   

            // Generate a new accessToken
            user.accessToken = generateAccessToken(user);

            if(context.res !== undefined) 
            {
                context.res.cookie(config.refreshToken_cookie_name, user.refreshToken, {httpOnly: true, secure: config.use_secured_cookies, signed: true})
            }

            // Return user
            return user;
            
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
    resolve: async function (root: unknown, {firstName, lastName, mail, password}: Record<string, string>, context: QueryContext, _info: GraphQLResolveInfo) {
        try {
            // Check if required parameters are all set
            if(isStringEmpty(firstName) || isStringEmpty(lastName) || isStringEmpty(mail) || isStringEmpty(password)){
                throw new MissingRequiredParameterError();
            }

            // Validate firstName / lastName
            if(!isValidString(firstName) || !isValidString(lastName)) {
                throw new InvalidCharacterError()
            }

            // Validate the email
            const userMail = mail.toLowerCase().trim()
            if(!isValidEmail(userMail)) {
                throw new InvalidMailFormatError()
            }

            // Check if user already exists
            const existingUser = await User.findOne({where: {mail: userMail}})
            if(existingUser != null)
            {
                throw new UserMailAlreadyUsedError()
            }

            // Hash the password
            const hashed_password = crypto.createHash('md5').update(password).digest("hex");
            
            // Create the user
            const user = await User.create({
                firstName,
                lastName,
                mail: userMail,
                password: hashed_password,
                refreshToken: uuidv4()
            })

            // Generate a new accessToken
            user.accessToken = generateAccessToken(user);

            if(context.res !== undefined) 
            {
                context.res.cookie(config.refreshToken_cookie_name, user.refreshToken, {httpOnly: true, secure: config.use_secured_cookies, signed: true})
            }

            // Return user
            return user;
            
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
    resolve: async function (_root: unknown, {refreshToken}: Record<string, string | null>, context: QueryContext, _info: GraphQLResolveInfo) {
        try {
            // Validate input
            if(refreshToken == null) {
                refreshToken = context.refreshToken
            }
    
            if(isStringEmpty(refreshToken)) {
                throw new MissingRequiredParameterError()
            }

            // Try to find a user matching this refreshToken
            const user = await User.findOne({where: {refreshToken: refreshToken}})
            if(!user){
                throw new UserNotAllowedError()
            }

            // Generate a new accessToken
            user.accessToken = generateAccessToken(user);

            // Return user
            return user;

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
    resolve: async function (root: unknown, {firstName, lastName, mail}: Record<string, string>, context: QueryContext, _info: GraphQLResolveInfo) {
        // Check if the user is authenticated
        if(context.user == null) {
            throw new UserNotAllowedError()
        }

        // Check if required parameters are all set
        if(isStringEmpty(firstName) || isStringEmpty(lastName) || isStringEmpty(mail)){
            throw new MissingRequiredParameterError();
        }

        // Validate firstName / lastName
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
        const user = await User.findOne({where: {id: context.user.id }})
        const newAttributes = {
            mail: userMail,
            firstName,
            lastName
        }

        await user?.update(newAttributes)
        
        // Return updated user
        return user
    }
}

// Export module
export default usersMutations;
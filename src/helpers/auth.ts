/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Imports
import jwt from "jsonwebtoken"
import { Request } from "express"

// Models
import { User, Media } from '@models'

// Load configuration
import {loadConfig} from '@helpers/global'

const config = loadConfig()

// Generate an access token for a user
export const generateAccessToken = (user: User) : string => {
    
    return jwt.sign({ sub: user.id }, config.auth.server_secret_key, {expiresIn: config.auth.access_token_expiration})
}

// Extract token from header
export const getAuthTokenFromHeader = (req: Request) : string | null => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') 
    { 
        const token = req.headers.authorization.split(' ')[1];
        // Try to decode the auth Token and verify his validity
        try {
            jwt.verify(token, config.auth.server_secret_key);

            // If we arrive here, then the auth token is valid and we should proceed
            return token
        }
        catch {}
    }

    // If we arrive here, the auth token is not supplied or not valid
    return null;
}

// Retrieve user from token
export const getUserFromToken = (tokenData: any) : Promise<User | null> => {
    return new Promise((resolve) => {
        User.findOne({where: {id: tokenData.sub}, include: [{model: Media, as: 'medias'}]}).then((user : User | null) => {
            if (user) {
                resolve(user)
            } else {
                resolve(null)
            }
        })
    })
  }
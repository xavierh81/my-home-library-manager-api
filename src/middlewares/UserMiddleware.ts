/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Helpers
import {getUserFromToken} from '@helpers/auth'

// Define a user middleware to get user information from the request
export default async (req: any, res: any, next: any) : Promise<void> => {
    // Extract user
    if(req.token !== undefined && req.token != null)
    {   
        req.user = await getUserFromToken(req.token)
    }
    next();
}
// Helpers
const {getUserFromToken} = require('@helpers/auth')

// Define a user middleware to get user information from the request
module.exports = async (req: any, res: any, next: any) => {
    // Extract user
    if(req.token !== undefined && req.token != null)
    {   
        req.user = await getUserFromToken(req.token)
    }
    next();
}
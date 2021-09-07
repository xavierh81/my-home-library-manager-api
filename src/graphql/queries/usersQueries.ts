// Imports
const {GraphQLList} = require('graphql')
const {resolver} = require('graphql-sequelize');

// Load needed GraphQL Types
const {userType} = require('@defs_graphql/types/usersTypes')

// Custom errors
const { 
    UserNotAllowedError 
} = require('@defs_graphql/errors')

// Define core object
const usersQueries : any = {}

// Retrieve the profile of logged user
usersQueries.user = {
    type: userType,
    args: {},
    resolve: async function (root:any, {}, context: any, info: any) {

        if(context.user == null) {
            throw new UserNotAllowedError()
        }

        return context.user;
    }
}

// Export module
export default usersQueries
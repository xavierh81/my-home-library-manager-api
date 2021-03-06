// Imports
const {GraphQLList} = require('graphql')
const {resolver} = require('graphql-sequelize');

// Load configuration and models
const models = require('@models')

// Load needed GraphQL Types
const {userType} = require('@defs_graphql/types/usersTypes')

// Custom errors
const { 
    UserNotAllowedError 
} = require('@defs_graphql/errors')

// Define core object
const usersQueries = {}

// Retrieve the profile of logged user
usersQueries.user = {
    type: userType,
    args: {},
    resolve: async function (root, {}, context, info) {
        if(context.user == null) {
            throw new UserNotAllowedError()
        }

        return context.user;
    }
}

// Export module
module.exports.usersQueries = usersQueries;
// Imports
const {GraphQLList} = require('graphql')
const {resolver} = require('graphql-sequelize');

// Load configuration and models
const models = require('@models')

// Load needed GraphQL Types
const {userType} = require('@graphql/types/usersTypes')

// Define core object
const usersQueries = {}


// TEST: List of all existing users
usersQueries.users = {
    type: GraphQLList(userType),
    args: {},
    resolve: async function (root, {}, context, info) {
        const users = await models.User.findAll();

        return users;
    }
}

// Export module
module.exports.usersQueries = usersQueries;
// Imports
const {GraphQLObjectType,GraphQLString} = require('graphql')
const models = require('@models')
const { attributeFields, resolver, typeMapper } = require('graphql-sequelize');

// Define all types
let userType = new GraphQLObjectType({
    name: 'User',
    description :'User',
    fields: Object.assign(attributeFields(models.User), {})
})

// Exports
module.exports.userType = userType;
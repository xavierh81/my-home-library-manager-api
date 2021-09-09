// Imports
import {GraphQLObjectType,GraphQLString} from 'graphql'

const models = require('@models')
const { attributeFields, resolver, typeMapper } = require('graphql-sequelize');

// Define all types
let userType = new GraphQLObjectType({
    name: 'User',
    description :'User',
    fields: Object.assign(attributeFields(models.User), {
        accessToken: {
            type: GraphQLString
        }
    })
})

// Exports
export {
    userType
}
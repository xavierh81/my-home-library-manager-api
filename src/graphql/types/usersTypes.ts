// Imports
import {GraphQLInt, GraphQLObjectType,GraphQLString} from 'graphql'

// Define all types
const userType = new GraphQLObjectType({
    name: 'User',
    description :'User',
    fields: {
        id: {
            type: GraphQLInt
        },
        mail: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        },
        refreshToken: {
            type: GraphQLString
        },
        firstName: {
            type: GraphQLString
        },
        lastName: {
            type: GraphQLString
        },
        accessToken: {
            type: GraphQLString
        }
    }
})

// Exports
export {
    userType
}
// Imports
import {GraphQLInt, GraphQLList, GraphQLObjectType,GraphQLString} from 'graphql'
import {mediaType} from './mediasTypes'

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
        },
        medias: {
            type: GraphQLList(mediaType)
        }
    }
})

// Exports
export {
    userType
}
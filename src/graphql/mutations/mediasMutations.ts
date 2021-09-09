// Imports
import { GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { MediaSearchResult } from "@interfaces/medias"
const {resolver} = require('graphql-sequelize');

// Models
import { User } from '@models'

// GraphQL Types
import {enumMediaType, searchMediaResultType} from '@defs_graphql/types/mediasTypes'

// Helpers 
import { isStringEmpty, isValidString } from '@helpers/string'
import { isObjectEmpty } from "@helpers/object"

// Configuration
var env       = process.env.SERVER_ENV || "local";
var config    = require('@config/config')[env];

// Custom errors
import { 
    MissingRequiredParameterError, 
    UserNotAllowedError
} from '@defs_graphql/errors'

// Define core object
const mediasMutations : any = {}

// Search a media with a text and a mediaType
mediasMutations.searchMedia = {
    type: GraphQLList(searchMediaResultType),
    args: {
        text: {
            description: "Media title",
            type: new GraphQLNonNull(GraphQLString)
        },
        mediaType: {
            description: "Media type",
            type: new GraphQLNonNull(enumMediaType)
        }
    },
    resolve: async function (root: any, {text, mediaType}: any, context: any, info: any) {
        try {
            // Check if the user is authenticated
            // if(context.user == null) {
            //     throw new UserNotAllowedError()
            // }

            // Check if required parameters are all set
            if(isStringEmpty(text) || isObjectEmpty(mediaType)){
                throw new MissingRequiredParameterError();
            }

            let results : MediaSearchResult[] = [];

            return results
            
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

// Export module
export default mediasMutations;
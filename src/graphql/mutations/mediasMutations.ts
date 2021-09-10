// Imports
import { GraphQLList, GraphQLNonNull, GraphQLResolveInfo, GraphQLString } from "graphql";
import { MediaSearchResult } from "@interfaces/medias"

// GraphQL Types
import {enumMediaType, searchMediaResultType} from '@defs_graphql/types/mediasTypes'
import { QueryContext } from "@interfaces/queryContext";
import { GraphQLResolver } from "@interfaces/GraphQLResolver";

// Helpers 
import { isStringEmpty } from '@helpers/string'
import { isObjectEmpty } from "@helpers/object"

// Custom errors
import { 
    MissingRequiredParameterError, UserNotAllowedError
} from '@defs_graphql/errors'

// Define core object
const mediasMutations : Record<string, GraphQLResolver> = {}

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
    resolve: async function (_root: unknown, {text, mediaType}: Record<string, never>, context: QueryContext, _info: GraphQLResolveInfo) {
        try {
            // Check if the user is authenticated
            if(context.user == null) {
                throw new UserNotAllowedError()
            }

            // Check if required parameters are all set
            if(isStringEmpty(text) || isObjectEmpty(mediaType)){
                throw new MissingRequiredParameterError();
            }

            const results : MediaSearchResult[] = [];

            return results
            
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

// Export module
export default mediasMutations;
// Imports
import { GraphQLList, GraphQLNonNull, GraphQLResolveInfo, GraphQLString } from "graphql";

// GraphQL Types
import {enumMediaType, searchMediaResultType} from '@defs_graphql/types/mediasTypes'
import { QueryContext } from "@interfaces/queryContext";
import { GraphQLResolver } from "@interfaces/GraphQLResolver";

// Helpers 
import { isStringEmpty } from '@helpers/string'
import { isObjectEmpty } from "@helpers/object"

// Custom errors
import { 
    MissingRequiredParameterError, NotAvailableError, UserNotAllowedError
} from '@defs_graphql/errors'

// Others imports
import MediasManager, {MediaSearchResult}  from "@core/mediasManager"
import { media_types } from "@root/config/constants"

// Define core object
const mediasQueries : Record<string, GraphQLResolver> = {}

// Search a media with a text and a mediaType
mediasQueries.searchMedia = {
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

            // Proceed with the search
            const mediasManager: MediasManager = new MediasManager();
            let results : MediaSearchResult[] = [];

            switch (mediaType) {
                case media_types.MOVIE:
                    results = await mediasManager.searchMovies(text);
                    break;

                default: 
                    throw new NotAvailableError()
            }

            return results
            
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

// Export module
export default mediasQueries;
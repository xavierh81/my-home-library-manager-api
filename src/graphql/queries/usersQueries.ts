// Imports
import { GraphQLResolveInfo } from 'graphql'

// Load needed GraphQL Types
import { userType } from '@defs_graphql/types/usersTypes'
import { QueryContext } from '@interfaces/queryContext'
import { GraphQLResolver } from '@interfaces/GraphQLResolver'

// Custom errors
import { 
    UserNotAllowedError 
} from '@defs_graphql/errors'

// Define core object
const usersQueries : Record<string, GraphQLResolver> = {}

// Retrieve the profile of logged user
usersQueries.user = {
    type: userType,
    resolve: async function (_root: unknown, args:unknown, context: QueryContext, _info: GraphQLResolveInfo) {

        if(context.user == null) {
            throw new UserNotAllowedError()
        }

        return context.user;
    }
}

// Export module
export default usersQueries
// Load all GraphQL queries
import usersQueries from './usersQueries'
import mediasQueries from './mediasQueries'

// Format main queries object with merging all queries defined in files from graphql/queries folder
const queries = {
    ...usersQueries,
    ...mediasQueries
}

// Export module
export default queries
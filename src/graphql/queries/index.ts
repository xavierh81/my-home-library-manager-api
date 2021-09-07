// Load all GraphQL queries
import usersQueries from './usersQueries'

// Format main queries object with merging all queries defined in files from graphql/queries folder
const queries = {
    ...usersQueries
}

// Export module
export default queries
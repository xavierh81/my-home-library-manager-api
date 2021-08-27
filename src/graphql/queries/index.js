// Load all GraphQL queries 
const { usersQueries } = require('@defs_graphql/queries/usersQueries')

// Format main queries object with merging all queries defined in files from graphql/queries folder
const queries = {
    ...usersQueries
}

// Export module
module.exports.queries = queries;
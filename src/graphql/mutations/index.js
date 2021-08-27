// Load all GraphQL mutations 
const { usersMutations } = require('@defs_graphql/mutations/usersMutations')

// Format main mutations object with merging all mutations defined in files from graphql/mutations folder
const mutations = {
    ...usersMutations
}

// Export module
module.exports.mutations = mutations;
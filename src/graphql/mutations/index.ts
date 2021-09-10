// Load all GraphQL mutations 
import usersMutations from './usersMutations'

// Format main mutations object with merging all mutations defined in files from graphql/mutations folder
const mutations = {
    ...usersMutations,
}

// Export module
export default mutations
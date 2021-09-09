// Load all GraphQL mutations 
import usersMutations from './usersMutations'
import mediasMutations from './mediasMutations'

// Format main mutations object with merging all mutations defined in files from graphql/mutations folder
const mutations = {
    ...usersMutations,
    ...mediasMutations
}

// Export module
export default mutations
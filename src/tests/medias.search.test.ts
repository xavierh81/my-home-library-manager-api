// Imports
import gql from "graphql-tag"

// Load constants
import {
    GLOBAL_MISSING_REQUIRED_PARAMETER_ERROR_CODE, 
    GLOBAL_WRONG_MAIL_FORMAT_ERROR_CODE,
    GLOBAL_NOT_ALLOWED_CHARACTER_ERROR_CODE,
    USER_MAIL_ALREADY_USED_ERROR_CODE,
    USER_NOT_ALLOWED_ERROR_CODE
} from '@defs_graphql/errors/codes'

// Models
import {User} from '@models'

// Load server
import mhlmServer from '@root/server'

// Helper method to add a user context to server calls
const addUserContext = async () => {
    mhlmServer.server.context = {
        user: await User.findOne({where: {id: 1}})
    }
}

// Helper method to remove user context from server calls
const removeUserContext = async () => {
    mhlmServer.server.context = {}
}

//
// Core
//

// All tests regarding Movie search
describe('Retrieve Movie API', () => {
    const retrieveMovieQuery = gql`
        query searchMedias($text: String!, $mediaType: MediaType!) 
        { 
            searchMedias(text: $text, mediaType: $mediaType) 
            {
                title,
                originalTitle,
                releaseDate,
                imageUrl,
                summary,

                searchSource,
                searchSourceMediaId
            }
        }
    `

    test('Check missing parameter', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: retrieveMovieQuery,
        });

        expect(result.errors).not.toBeUndefined();
    })

    test('Check wrong media type', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: retrieveMovieQuery,
            variables: {
                text: '',
                mediaType: 'test'
            }
        });

        expect(result.errors).not.toBeUndefined();
    })

    test('Missing authentication', async () => {
        await removeUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: retrieveMovieQuery,
            variables: {
                text: 'The Lion King',
                mediaType: 'MOVIE'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors![0].extensions!.code).toEqual(USER_NOT_ALLOWED_ERROR_CODE)
    })

    test('Search success', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: retrieveMovieQuery,
            variables: {
                text: 'The Lion King',
                mediaType: 'MOVIE'
            }
        });

        expect(result.errors).toBeUndefined();
        expect(result.data!.searchMedias[0].searchSourceMediaId).toBe("8587")
        expect(result.data!.searchMedias[0].releaseDate).toBe("1994-06-23")
        expect(result.data!.searchMedias[0].title).toBe("The Lion King")
    })
})

// At the end, close DB Connection
afterAll(() => {
    // Closing the DB connection allows Jest to exit successfully.
    mhlmServer.db.sequelize.close();
});
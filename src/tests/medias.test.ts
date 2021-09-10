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
        query searchMedia($text: String!, $mediaType: MediaType!) 
        { 
            searchMedia(text: $text, mediaType: $mediaType) 
            {
                id,
                title,
                originalTitle,
                releaseDate,
                imageUrl,
                summary
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
                text: 'Le Roi Lion',
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
                text: 'Le Roi Lion',
                mediaType: 'MOVIE'
            }
        });

        expect(result.errors).toBeUndefined();
        expect(result.data!.searchMedia[0].id).toBe(8587)
        expect(result.data!.searchMedia[0].releaseDate).toBe("1994-06-23")
        expect(result.data!.searchMedia[0].title).toBe("Le Roi lion")
    })
})

// At the end, close DB Connection
afterAll(() => {
    // Closing the DB connection allows Jest to exit successfully.
    mhlmServer.db.sequelize.close();
});
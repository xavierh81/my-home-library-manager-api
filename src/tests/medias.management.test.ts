// Imports
import gql from "graphql-tag"
import moment from 'moment'
import axios from 'axios'

// Load constants
import {
    GLOBAL_MISSING_REQUIRED_PARAMETER_ERROR_CODE, 
    USER_NOT_ALLOWED_ERROR_CODE,
    MEDIA_ALREADY_EXISTS_ERROR_CODE
} from '@defs_graphql/errors/codes'
import {media_search_sources} from '@config/constants' 

// Models
import {User} from '@models'

// Helpers
import { getEnumKeyByValue } from '@helpers/string'

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
describe('Add a media', () => {
    const saveMovieMutation = gql`
        mutation saveMedia($title: String!, $originalTitle: String, $summary: String, $imageUrl: String, $releaseDate: Date, $rating: Float, $mediaType: MediaType!, $searchSource: SearchSource!, $searchSourceMediaId: String!) 
        { 
            saveMedia(title: $title, originalTitle: $originalTitle, summary: $summary, imageUrl: $imageUrl, releaseDate: $releaseDate, rating: $rating, mediaType: $mediaType, searchSource:$searchSource, searchSourceMediaId:$searchSourceMediaId) 
            {
                id,
                title,
                originalTitle,
                releaseDate,
                imageUrl,
                summary,
                userId
            }
        }
    `

    test('Check missing parameter 1', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: saveMovieMutation,
            variables: {
                title: '',
            }
        });

        expect(result.errors).not.toBeUndefined();
    })

    test('Check missing parameter 2', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: saveMovieMutation,
            variables: {
                title: '',
                mediaType: "MOVIE",
                searchSource: getEnumKeyByValue(media_search_sources, media_search_sources.TMDB),
                searchSourceMediaId: ''
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors![0].extensions!.code).toEqual(GLOBAL_MISSING_REQUIRED_PARAMETER_ERROR_CODE)
    })

    test('Check wrong media type', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: saveMovieMutation,
            variables: {
                title: '',
                mediaType: 'test',
                searchSource: getEnumKeyByValue(media_search_sources, media_search_sources.TMDB),
                searchSourceMediaId: ''
            }
        });

        expect(result.errors).not.toBeUndefined();
    })

    test('Missing authentication', async () => {
        await removeUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: saveMovieMutation,
            variables: {
                title: 'The Lion King',
                mediaType: 'MOVIE',
                searchSource: getEnumKeyByValue(media_search_sources, media_search_sources.TMDB),
                searchSourceMediaId: ''
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors![0].extensions!.code).toEqual(USER_NOT_ALLOWED_ERROR_CODE)
    })

    test('Save success', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: saveMovieMutation,
            variables: {
                title: 'The Lion King',
                mediaType: 'MOVIE',
                releaseDate: '1994-06-23T00:00:00.000Z',
                imageUrl: 'https://image.tmdb.org/t/p/w500//sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
                searchSource: getEnumKeyByValue(media_search_sources, media_search_sources.TMDB),
                searchSourceMediaId: '8587'
            }
        });

        expect(result.errors).toBeUndefined();
        expect(result.data!.saveMedia.id).toBe(1)
        expect(result.data!.saveMedia.releaseDate).toBe(moment("1994-06-23T00:00:00Z").unix() * 1000)
        expect(result.data!.saveMedia.title).toBe("The Lion King")
        expect(result.data!.saveMedia.userId).toBe(1)

        // Check if image has been saved on our service
        const imageResponse = await axios.get(result.data!.saveMedia.imageUrl)
        expect(imageResponse.status).toBe(200)
    })

    test('Media already exists', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: saveMovieMutation,
            variables: {
                title: 'The Lion King',
                mediaType: 'MOVIE',
                searchSource: getEnumKeyByValue(media_search_sources, media_search_sources.TMDB),
                searchSourceMediaId: '8587'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors![0].extensions!.code).toEqual(MEDIA_ALREADY_EXISTS_ERROR_CODE)
    })
})

describe('Manage user medias', () => {
    test.todo('Retrieve media')
})

// At the end, close DB Connection
afterAll(() => {
    // Closing the DB connection allows Jest to exit successfully.
    mhlmServer.db.sequelize.close();
});
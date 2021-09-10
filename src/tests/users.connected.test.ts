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

// All tests regarding UpdateUser mutation
describe('Retrieve user API', () => {
    const retrieveUserQuery = gql`
        query user {
            user {
                id,
                mail
            }
        }
    `

    test('Missing authentication', async () => {
        await removeUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: retrieveUserQuery,
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors![0].extensions!.code).toEqual(USER_NOT_ALLOWED_ERROR_CODE)
    })

    test('User retrieved', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: retrieveUserQuery
        });

        expect(result.errors).toBeUndefined();
        expect(result.data).not.toBeUndefined();
        expect(result.data!.user.id).toBe(1)
        expect(result.data!.user.mail).toBe('test_user@mail.com')
    })
})

describe('Update user API', () => {

    const updateUserMutation = gql`
        mutation updateUser($firstName: String!, $lastName: String!, $mail: String!) {
            updateUser(firstName: $firstName, lastName: $lastName, mail: $mail) {
                id,
                mail,
                firstName,
                lastName
            }
        }
    `

    test('Check missing parameter', async () => {
        await removeUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: updateUserMutation,
        });

        expect(result.errors).not.toBeUndefined();
    })

    test('Check missing auth', async () => {
        await removeUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: updateUserMutation,
            variables: {
                firstName: 'User',
                lastName: '',
                mail: 'new_user@mail.com'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors![0].extensions!.code).toEqual(USER_NOT_ALLOWED_ERROR_CODE)
    })

    test('Check empty parameter', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: updateUserMutation,
            variables: {
                firstName: 'User',
                lastName: '',
                mail: 'new_user@mail.com'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors![0].extensions!.code).toEqual(GLOBAL_MISSING_REQUIRED_PARAMETER_ERROR_CODE)
    })

    test('Check not allowed characters', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: updateUserMutation,
            variables: {
                firstName: 'User',
                lastName: 'Lastname!*$',
                mail: 'xxxxxx@xxx@fr'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors![0].extensions!.code).toEqual(GLOBAL_NOT_ALLOWED_CHARACTER_ERROR_CODE)
    })

    test('Check not-well formatted mail', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: updateUserMutation,
            variables: {
                firstName: 'User',
                lastName: 'Lastname',
                mail: 'xxxxxx@xxx@fr'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors![0].extensions!.code).toEqual(GLOBAL_WRONG_MAIL_FORMAT_ERROR_CODE)
    })

    test('Check mail already used', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: updateUserMutation,
            variables: {
                firstName: 'User',
                lastName: 'Lastname',
                mail: 'test_user_2@mail.com'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors![0].extensions!.code).toEqual(USER_MAIL_ALREADY_USED_ERROR_CODE)
    })

    test('User updated', async () => {
        await addUserContext();

        const result = await mhlmServer.server.executeOperation({
            query: updateUserMutation,
            variables: {
                firstName: 'User',
                lastName: 'Lastname',
                mail: 'test_user_4@mail.com'
            }
        });

        expect(result.errors).toBeUndefined();
        expect(result.data).not.toBeUndefined();
        expect(result.data!.updateUser.id).toBe(1)
        expect(result.data!.updateUser.mail).toBe('test_user_4@mail.com')
    })
})


// At the end, close DB Connection
afterAll(() => {
    // Closing the DB connection allows Jest to exit successfully.
    mhlmServer.db.sequelize.close();
});
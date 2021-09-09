// Imports
import gql from 'graphql-tag';

// Load constants
import {
    GLOBAL_MISSING_REQUIRED_PARAMETER_ERROR_CODE, 
    GLOBAL_WRONG_MAIL_FORMAT_ERROR_CODE,
    GLOBAL_NOT_ALLOWED_CHARACTER_ERROR_CODE,
    USER_INVALID_CREDENTIALS_ERROR_CODE,
    USER_MAIL_ALREADY_USED_ERROR_CODE
} from '@defs_graphql/errors/codes'

// Load server
import mhlmServer from '@root/server'

// All tests regarding Login mutation
describe('Login API', () => {

    const loginMutation = gql`
        mutation login($mail: String!, $password: String!) {
            login(mail: $mail, password: $password) {
                id,
                mail,
                firstName,
                lastName
            }
        }
    `

    test('Check missing parameter', async () => {
        const result = await mhlmServer.server.executeOperation({
            query: loginMutation
        });

        expect(result.errors).not.toBeUndefined();
    })

    test('Check empty parameter', async () => {
        const result = await mhlmServer.server.executeOperation({
            query: loginMutation,
            variables: {
                mail: ' ',
                password: ''
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors[0].extensions.code).toEqual(GLOBAL_MISSING_REQUIRED_PARAMETER_ERROR_CODE)
    })

    test('Check not-well formatted mail', async () => {
        const result = await mhlmServer.server.executeOperation({
            query: loginMutation,
            variables: {
                mail: 'xxxxxx@xxx@fr',
                password: 'test'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors[0].extensions.code).toEqual(GLOBAL_WRONG_MAIL_FORMAT_ERROR_CODE)
    })

    test('Check wrong credentials', async () => {
        const result = await mhlmServer.server.executeOperation({
            query: loginMutation,
            variables: {
                mail: 'test_user@mail.com',
                password: 'xxxxx'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors[0].extensions.code).toEqual(USER_INVALID_CREDENTIALS_ERROR_CODE)
    })

    test('Login success', async () => {
        const result = await mhlmServer.server.executeOperation({
            query: loginMutation,
            variables: {
                mail: 'test_user@mail.com',
                password: 'abcd1234'
            }
        });
        
        expect(result.errors).toBeUndefined();
        expect(result.data).not.toBeUndefined();
        expect(result.data.login.id).toBe(1)
    })
})


// All tests regarding Register mutation
describe('Register API', () => {

    const registerMutation = gql`
        mutation register($firstName: String!, $lastName: String!, $mail: String!, $password: String!) {
            register(firstName: $firstName, lastName: $lastName, mail: $mail, password: $password) {
                id,
                mail,
                firstName,
                lastName
            }
        }
    `

    test('Check missing parameter', async () => {
        const result = await mhlmServer.server.executeOperation({
            query: registerMutation
        });

        expect(result.errors).not.toBeUndefined();
    })

    test('Check empty parameter', async () => {
        const result = await mhlmServer.server.executeOperation({
            query: registerMutation,
            variables: {
                firstName: 'User',
                lastName: '',
                mail: 'new_user@mail.com',
                password: ''
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors[0].extensions.code).toEqual(GLOBAL_MISSING_REQUIRED_PARAMETER_ERROR_CODE)
    })

    test('Check not allowed characters', async () => {
        const result = await mhlmServer.server.executeOperation({
            query: registerMutation,
            variables: {
                firstName: 'User',
                lastName: 'Lastname!*$',
                mail: 'xxxxxx@xxx@fr',
                password: 'test'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors[0].extensions.code).toEqual(GLOBAL_NOT_ALLOWED_CHARACTER_ERROR_CODE)
    })

    test('Check not-well formatted mail', async () => {
        const result = await mhlmServer.server.executeOperation({
            query: registerMutation,
            variables: {
                firstName: 'User',
                lastName: 'Lastname',
                mail: 'xxxxxx@xxx@fr',
                password: 'test'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors[0].extensions.code).toEqual(GLOBAL_WRONG_MAIL_FORMAT_ERROR_CODE)
    })

    test('Check mail already used', async () => {
        const result = await mhlmServer.server.executeOperation({
            query: registerMutation,
            variables: {
                firstName: 'User',
                lastName: 'Lastname',
                mail: 'test_user@mail.com',
                password: 'test'
            }
        });

        expect(result.errors).not.toBeUndefined();
        expect(result.errors[0].extensions.code).toEqual(USER_MAIL_ALREADY_USED_ERROR_CODE)
    })

    test('Register success', async () => {
        const result = await mhlmServer.server.executeOperation({
            query: registerMutation,
            variables: {
                firstName: 'New user',
                lastName: 'Lastname',
                mail: 'test_user_3@mail.com',
                password: 'abcd12345678'
            }
        });
        
        expect(result.errors).toBeUndefined();
        expect(result.data).not.toBeUndefined();
        expect(result.data.register.id).toBe(3)
        expect(result.data.register.mail).toBe('test_user_3@mail.com')
    })
})


// At the end, close DB Connection
afterAll(() => {
    // Closing the DB connection allows Jest to exit successfully.
    mhlmServer.db.sequelize.close();
});
// Imports
const gql = require("graphql-tag")

// Load server
const {server, models} = require('../server.js')

// Describe users API
describe('Users API', () => {
    test('Retrieve users list', async () => {
        const result = await server.executeOperation({
            query: gql`
                query users {
                    users {
                        id,
                        mail,
                        firstName,
                        lastName
                    }
                }
            `
        });

        expect(result.errors).toBeUndefined();
        expect(result.data).not.toBeUndefined();
        expect(result.data.users).not.toBeUndefined();
        expect(result.data.users.length).toBeGreaterThan(0)
        expect(result.data.users[0].firstName).toBe('Test');
    })
})

// At the end, close DB Connection
afterAll(() => {
    // Closing the DB connection allows Jest to exit successfully.
    models.sequelize.close();
});
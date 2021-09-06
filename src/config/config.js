module.exports = {
    local: {
        front_url: 'http://localhost:4001',
        graphql_explorer_url: 'https://studio.apollographql.com',
        auth: {
            server_secret_key: process.env.MHLM_SERVER_SECRET_KEY,
            access_token_expiration: 86400,
            use_secured_cookies: false,
            refreshToken_cookie_name: 'mhlm_refreshToken'
        }
    }
}
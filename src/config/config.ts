/* eslint-disable @typescript-eslint/no-explicit-any */
const config: any = {
    local: {
        front_url: 'http://localhost:4001',
        graphql_explorer_url: 'https://studio.apollographql.com',
        auth: {
            server_secret_key: process.env.MHLM_SERVER_SECRET_KEY,
            access_token_expiration: 86400,
            use_secured_cookies: false,
            refreshToken_cookie_name: 'mhlm_refreshToken'
        },
        tmdb: {
            api_key: process.env.MHLM_TMDB_API_KEY,
            api_secret_key: process.env.MHLM_TMDB_API_SECRET_KEY,
            language: 'en-US'
        }
    }
}

export default config
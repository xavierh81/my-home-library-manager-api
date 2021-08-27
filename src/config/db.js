module.exports = {
  test: {
    username: process.env.MHLM_TEST_DB_USERNAME,
    password: process.env.MHLM_TEST_DB_PASSWORD,
    database: process.env.MHLM_TEST_DB_NAME,
    host: process.env.MHLM_TEST_DB_HOST,
    port: process.env.MHLM_TEST_DB_PORT,
    dialect: "postgres",
    timezone: "+00:00",
    logging: false
  },
  local: {
    username: process.env.MHLM_DB_USERNAME,
    password: process.env.MHLM_DB_PASSWORD,
    database: process.env.MHLM_DB_NAME,
    host: process.env.MHLM_DB_HOST,
    port: process.env.MHLM_DB_PORT,
    dialect: "postgres",
    timezone: "+00:00",
    logging: false
  },
  development: {
    
  },
  production: {
    
  }
}
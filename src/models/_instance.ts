/* eslint-disable import/no-dynamic-require */
const Sequelize = require('sequelize');

const currentEnv = process.env.NODE_ENV || 'local';
const dbConfig = require('@config/db.js')[currentEnv];

// Init Sequelize instance
let sequelize: any;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

const db = {
    sequelize,
    Sequelize,
}

export default db
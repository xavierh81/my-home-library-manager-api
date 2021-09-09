// Imports
import { Sequelize } from 'sequelize'

// Configuration
import {loadDbConfig} from '@helpers/global'
const config = loadDbConfig()

// Init Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {
    sequelize,
    Sequelize,
}

export default db
/* eslint-disable @typescript-eslint/no-explicit-any */

import config from '@config/config';
import dbConfig from '@config/db'

export const loadConfig = () : any => {
    const env = process.env.SERVER_ENV || "local";
    return config[env]
}

export const loadDbConfig = () : any => {
    const env = process.env.SERVER_ENV || "local";
    return dbConfig[env]
}
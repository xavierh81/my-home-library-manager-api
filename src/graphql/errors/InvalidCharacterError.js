const { ApolloError } = require('apollo-server-errors')
const {GLOBAL_NOT_ALLOWED_CHARACTER_ERROR_CODE} = require('./codes')

module.exports = class InvalidCharacterError extends ApolloError {
  constructor(message) {
    super("Some used characters are not allowed. Please do not use special characters.", GLOBAL_NOT_ALLOWED_CHARACTER_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidCharacterError' });
  }
}
const { ApolloError } = require('apollo-server-errors')
const {GLOBAL_NOT_ALLOWED_CHARACTER_ERROR_CODE} = require('./codes')

export default class InvalidCharacterError extends ApolloError {
  constructor(message?: string) {
    super("Some used characters are not allowed. Please do not use special characters.", GLOBAL_NOT_ALLOWED_CHARACTER_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidCharacterError' });
  }
}
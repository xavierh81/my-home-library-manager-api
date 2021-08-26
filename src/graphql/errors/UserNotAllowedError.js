const { ApolloError } = require('apollo-server-errors')
const {USER_NOT_ALLOWED_ERROR_CODE} = require('./codes')

module.exports = class InvalidMailFormatError extends ApolloError {
  constructor(message) {
    super("You must be authenticated to do this.", USER_NOT_ALLOWED_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidMailFormatError' });
  }
}
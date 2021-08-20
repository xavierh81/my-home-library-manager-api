const { ApolloError } = require('apollo-server-errors')
const {USER_INVALID_CREDENTIALS_ERROR_CODE} = require('./codes')

module.exports = class InvalidCredentialsError extends ApolloError {
  constructor(message) {
    super("These credentials are incorrect", USER_INVALID_CREDENTIALS_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidCredentialsError' });
  }
}
const { ApolloError } = require('apollo-server-errors')
const { USER_INVALID_CREDENTIALS_ERROR_CODE } = require('./codes')

export default class InvalidCredentialsError extends ApolloError {
  constructor(message: string) {
    super("Invalid credentials, please verify them and retry", USER_INVALID_CREDENTIALS_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidCredentialsError' });
  }
}
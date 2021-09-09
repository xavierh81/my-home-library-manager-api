const { ApolloError } = require('apollo-server-errors')
const {USER_NOT_ALLOWED_ERROR_CODE} = require('./codes')

export default class InvalidMailFormatError extends ApolloError {
  constructor(message?: string) {
    super("You must be authenticated to do this.", USER_NOT_ALLOWED_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidMailFormatError' });
  }
}
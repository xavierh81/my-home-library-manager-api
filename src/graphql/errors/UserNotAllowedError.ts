import { ApolloError } from 'apollo-server-errors'
import { USER_NOT_ALLOWED_ERROR_CODE } from './codes'

export default class InvalidMailFormatError extends ApolloError {
  constructor() {
    super("You must be authenticated to do this.", USER_NOT_ALLOWED_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidMailFormatError' });
  }
}
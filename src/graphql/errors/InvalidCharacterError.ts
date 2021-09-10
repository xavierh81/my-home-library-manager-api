import { ApolloError } from 'apollo-server-errors'
import { GLOBAL_NOT_ALLOWED_CHARACTER_ERROR_CODE } from './codes'

export default class InvalidCharacterError extends ApolloError {
  constructor() {
    super("Some used characters are not allowed. Please do not use special characters.", GLOBAL_NOT_ALLOWED_CHARACTER_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidCharacterError' });
  }
}
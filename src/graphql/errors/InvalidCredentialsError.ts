import { ApolloError } from 'apollo-server-errors'
import { USER_INVALID_CREDENTIALS_ERROR_CODE } from './codes'

export default class InvalidCredentialsError extends ApolloError {
  constructor() {
    super("Invalid credentials, please verify them and retry", USER_INVALID_CREDENTIALS_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidCredentialsError' });
  }
}
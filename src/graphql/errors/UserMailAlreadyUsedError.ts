import { ApolloError } from 'apollo-server-errors'
import { USER_MAIL_ALREADY_USED_ERROR_CODE } from './codes'

export default class UserMailAlreadyUsedError extends ApolloError {
  constructor() {
    super("This mail address is already used", USER_MAIL_ALREADY_USED_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'UserMailAlreadyUsedError' });
  }
}
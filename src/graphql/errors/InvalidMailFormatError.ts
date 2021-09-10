import { ApolloError } from 'apollo-server-errors'
import { GLOBAL_WRONG_MAIL_FORMAT_ERROR_CODE } from './codes'

export default class InvalidMailFormatError extends ApolloError {
  constructor() {
    super("The mail is not valid", GLOBAL_WRONG_MAIL_FORMAT_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidMailFormatError' });
  }
}
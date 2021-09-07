const { ApolloError } = require('apollo-server-errors')
const {GLOBAL_WRONG_MAIL_FORMAT_ERROR_CODE} = require('./codes')

export default class InvalidMailFormatError extends ApolloError {
  constructor(message: string) {
    super("The mail is not valid", GLOBAL_WRONG_MAIL_FORMAT_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidMailFormatError' });
  }
}
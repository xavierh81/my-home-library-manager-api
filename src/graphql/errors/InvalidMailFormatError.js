const { ApolloError } = require('apollo-server-errors')
const {GLOBAL_WRONG_MAIL_FORMAT_ERROR_CODE} = require('./codes')

module.exports = class InvalidMailFormatError extends ApolloError {
  constructor(message) {
    super("The mail is not valid", GLOBAL_WRONG_MAIL_FORMAT_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'InvalidMailFormatError' });
  }
}
const { ApolloError } = require('apollo-server-errors')
const {USER_MAIL_ALREADY_USED_ERROR_CODE} = require('./codes')

export default class UserMailAlreadyUsedError extends ApolloError {
  constructor(message?: string) {
    super("This mail address is already used", USER_MAIL_ALREADY_USED_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'UserMailAlreadyUsedError' });
  }
}
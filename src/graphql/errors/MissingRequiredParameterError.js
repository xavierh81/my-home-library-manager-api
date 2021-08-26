const { ApolloError } = require('apollo-server-errors')
const {GLOBAL_MISSING_REQUIRED_PARAMETER_ERROR_CODE} = require('./codes')

module.exports = class MissingRequiredParameterError extends ApolloError {
  constructor(message) {
    super("A required parameter is missing", GLOBAL_MISSING_REQUIRED_PARAMETER_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'MissingRequiredParameterError' });
  }
}
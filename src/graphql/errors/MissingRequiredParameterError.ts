import { ApolloError } from 'apollo-server-errors'
import { GLOBAL_MISSING_REQUIRED_PARAMETER_ERROR_CODE } from './codes'

export default class MissingRequiredParameterError extends ApolloError {
  constructor() {
    super("A required parameter is missing", GLOBAL_MISSING_REQUIRED_PARAMETER_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'MissingRequiredParameterError' });
  }
}
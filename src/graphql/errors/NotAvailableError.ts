import { ApolloError } from 'apollo-server-errors'
import { GLOBAL_FEATURE_NOT_AVAILABLE_ERROR_CODE } from './codes'

export default class NotAvailableError extends ApolloError {
  constructor() {
    super("This feature is not available for now", GLOBAL_FEATURE_NOT_AVAILABLE_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'NotAvailableError' });
  }
}
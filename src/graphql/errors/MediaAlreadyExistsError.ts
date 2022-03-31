import { ApolloError } from 'apollo-server-errors'
import { MEDIA_ALREADY_EXISTS_ERROR_CODE } from './codes'

export default class MediaAlreadyExistsError extends ApolloError {
  constructor() {
    super("This media already exists in your library.", MEDIA_ALREADY_EXISTS_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'MediaAlreadyExistsError' });
  }
}
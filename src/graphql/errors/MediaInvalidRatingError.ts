import { ApolloError } from 'apollo-server-errors'
import { MEDIA_INVALID_RATING_ERROR_CODE } from './codes'

export default class MediaInvalidRatingError extends ApolloError {
  constructor() {
    super("The rating value is invalid. It must be a decimal between 0 and 5.", MEDIA_INVALID_RATING_ERROR_CODE);

    Object.defineProperty(this, 'name', { value: 'MediaInvalidRatingError' });
  }
}
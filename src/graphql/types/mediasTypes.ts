// Imports
import {GraphQLObjectType,GraphQLString,GraphQLEnumType} from 'graphql'

// Constants
import {media_types} from '@config/constants' 

//
// Define all types
//

// Result of medias search
export const searchMediaResultType = new GraphQLObjectType({
  name: 'SearchMediaResultType',
  description :'Search result for a media search',
  fields: {
    title: {
      type: GraphQLString
    }
  }
})

// Input EnumType for mediaType 
export const enumMediaType = new GraphQLEnumType({
    name: 'MediaType',
    values: {
      MOVIE: { value: media_types.MOVIE },  
      BOOK: { value: media_types.BOOK }
    }
});
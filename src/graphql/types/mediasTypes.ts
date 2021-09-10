// Imports
import {GraphQLObjectType,GraphQLString,GraphQLEnumType, GraphQLInt} from 'graphql'

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
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    originalTitle: { type: GraphQLString },
    summary: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
    releaseDate: { type: GraphQLString }
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
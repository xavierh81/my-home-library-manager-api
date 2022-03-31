// Imports
import {GraphQLObjectType,GraphQLString,GraphQLEnumType, GraphQLInt, GraphQLFloat} from 'graphql'

// Types
import {GraphQLDate} from '@defs_graphql/types/additionalTypes'

// Constants
import {media_types,media_search_sources} from '@config/constants' 

//
// Define all types
//

// Input EnumType for mediaType 
export const enumMediaType = new GraphQLEnumType({
  name: 'MediaType',
  values: {
    MOVIE: { value: media_types.MOVIE },  
    BOOK: { value: media_types.BOOK }
  }
});

// Input EnumType for searchSource 
export const enumMediaSource = new GraphQLEnumType({
  name: 'SearchSource',
  values: {
    TMDB: { value: media_search_sources.TMDB }
  }
});

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
    releaseDate: { type: GraphQLString },
    rating: { type: GraphQLFloat },
    searchSource: { type: enumMediaSource },
    searchSourceMediaId: { type: GraphQLString }
  }
})


export const mediaType = new GraphQLObjectType({
  name: 'Media',
  description :'Media',
  fields: {
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    originalTitle: { type: GraphQLString },
    summary: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
    releaseDate: { type: GraphQLDate },
    rating: { type: GraphQLFloat },
    searchSource: { type: enumMediaSource },
    searchSourceMediaId: { type: GraphQLString },
    userId: { type: GraphQLInt}
  }
})
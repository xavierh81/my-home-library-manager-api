// Imports
import {GraphQLNonNull, GraphQLResolveInfo, GraphQLString,GraphQLFloat} from 'graphql'
import { Op } from 'sequelize'
import fetch from 'node-fetch'
import path from 'path'
import AWS from 'aws-sdk'
import mime from 'mime-types'
import { v4 as uuidv4 } from 'uuid';

// Models
import { User, Media } from '@models'

// GraphQL Types
import {enumMediaType, enumMediaSource, mediaType} from '@defs_graphql/types/mediasTypes'
import {GraphQLDate} from '@defs_graphql/types/additionalTypes'
import { QueryContext } from '@interfaces/queryContext';
import { GraphQLResolver } from '@interfaces/GraphQLResolver';

// Helpers 
import {loadConfig} from '@helpers/global'
import {isStringEmpty,isValidString} from '@helpers/string'

// Constants
import {media_search_sources} from '@config/constants' 

// Load configuration
const config = loadConfig();

// Custom errors
import { 
    MissingRequiredParameterError, 
    InvalidCharacterError,
    MediaAlreadyExistsError,
    MediaInvalidRatingError,
    UserNotAllowedError
} from '@defs_graphql/errors'

// Define core object
const mediasMutations : Record<string, GraphQLResolver> = {}

// Save a media in user library
mediasMutations.saveMedia = {
    type: mediaType,
    args: {
        title:{
            description: "Media's title",
            type: new GraphQLNonNull(GraphQLString)
        },
        originalTitle: {
            description: "Media's originalTitle",
            type: GraphQLString
        },
        summary: {
            description: "Media's originalTitle",
            type: GraphQLString
        },
        imageUrl: {
            description: "Media's originalTitle",
            type: GraphQLString
        },
        releaseDate: {
            description: "Media's originalTitle",
            type: GraphQLDate
        },
        rating: {
            description: "Media's originalTitle",
            type: GraphQLFloat
        },
        tmdbId: {
            description: "Media's TMDB Internal Id",
            type: GraphQLString
        },
        mediaType: {
            description: "Media type",
            type: new GraphQLNonNull(enumMediaType)
        },
        searchSource: {
            description: "Search source",
            type: new GraphQLNonNull(enumMediaSource)
        },
        searchSourceMediaId: {
            description: "Search source internal id",
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async function (root: unknown, {title, originalTitle, summary, imageUrl, releaseDate, rating, tmdbId, mediaType, searchSource, searchSourceMediaId}: Record<string, any>, context: QueryContext, _info: GraphQLResolveInfo) {
        try {
            // Check if the user is authenticated
            if(context.user == null) {
                throw new UserNotAllowedError()
            }

            // Check if required parameters are all set
            if(isStringEmpty(title)) {
                throw new MissingRequiredParameterError();
            }

            if(rating != null && (rating < 0 || rating > 5)) {
                throw new MediaInvalidRatingError()
            }

            // Check if this media is not already existing for this user
            const existingMedia = await Media.findOne({where: {
                type: mediaType,
                userId: context.user.id,
                searchSource,
                searchSourceMediaId
            }});
            if(existingMedia != null) {
                throw new MediaAlreadyExistsError();
            }

            // Create the media
            let mediaAttributes = {
                title: title.trim(),
                originalTitle: originalTitle ? originalTitle.trim() : null,
                summary,
                releaseDate: releaseDate ? releaseDate.toISOString() : null,
                rating,
                type: mediaType,
                searchSource,
                searchSourceMediaId,
                userId: context.user.id
            }

            const media = await Media.create(mediaAttributes)

            // Download the image (if specified) and upload it on S3
            if(imageUrl != null) {
                const response = await fetch(imageUrl);
                const buffer = await response.buffer();
                
                const s3 = new AWS.S3({
                    accessKeyId: config.aws.access_key_id,
                    secretAccessKey: config.aws.secret_access_key
                })

                const fileExtension = path.extname(imageUrl)
                const fileMimeType = mime.lookup(imageUrl)

                const params = {
                    Bucket: config.aws.bucket_name,
                    Key: `${config.aws.media_images_bucket_prefix}${media.id}_${uuidv4()}${fileExtension}`,
                    Body: buffer,
                    ACL:'public-read',
                    ContentType: fileMimeType ? fileMimeType : ''
                }

                const stored = await s3.upload(params).promise()
                
                await media.update({imageUrl: stored.Location})
            }

            return media;
            
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

// Export module
export default mediasMutations;
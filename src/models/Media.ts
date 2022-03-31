// Imports
import { DataTypes, Model, Optional } from 'sequelize'
import db from './_instance'

import {media_types} from '@config/constants'

// Declare the attributes in the Media model
interface MediaAttributes {
    id: number;
    type: number;
    title: string;
    originalTitle?: string;
    summary?: string;
    imageUrl?: string;
    releaseDate?: Date;
    rating?: number;

    searchSource: number;
    searchSourceMediaId: number;

    userId: number;
}
  
// Define optional attributes for Media
type MediaCreationAttributes = Optional<MediaAttributes, "id" | "originalTitle" | "summary" | "imageUrl" | "releaseDate" | "rating">
  
// Create the class with all these attributes
class Media extends Model<MediaAttributes, MediaCreationAttributes> implements MediaAttributes {
    public id!: number; 
    public type!: number;
    public title!: string;
    public originalTitle?: string;
    public summary?: string;
    public imageUrl?: string;
    public releaseDate?: Date;
    public rating?: number;

    public userId!: number;

    public searchSource!: number;
    public searchSourceMediaId!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
  
// Init Media entity
Media.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: new DataTypes.SMALLINT,
            allowNull: false,
            validate: {
                isInt: true,
                isIn: [
                    [
                        media_types.MOVIE,
                        media_types.BOOK
                    ]
                ]
            }
        },
        title: {
            type: new DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        originalTitle: {
            type: new DataTypes.STRING,
            allowNull: true,
        },
        summary: {
            type: new DataTypes.TEXT,
            allowNull: true,
        },
        imageUrl: {
            type: new DataTypes.STRING,
            allowNull: true,
        },
        releaseDate: {
            type: new DataTypes.STRING,
            allowNull: true,
        },
        rating: {
            type: new DataTypes.FLOAT,
            allowNull: true,
        },

        searchSource: {
            type: new DataTypes.SMALLINT,
            allowNull: false
        },
        searchSourceMediaId: {
            type: new DataTypes.STRING,
            allowNull: false
        },

        userId: {
            type: new DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
      tableName: "Medias",
      modelName: "Media",
      sequelize: db.sequelize,
    }
);

export default Media
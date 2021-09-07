// Imports
import { DataTypes, Model, Optional } from 'sequelize'
import db from './_instance'

// Declare the attributes in the User model
interface UserAttributes {
    id: number;
    mail: string;
    password: string;
    firstName: string;
    lastName: string;
    refreshToken: string;
}
  
// Define optional attributes for User
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}
  
// Create the class with all these attributes
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number; 
    public mail!: string;
    public password!: string;
    public firstName!: string;
    public lastName!: string;
    public refreshToken!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
  
// Init User entity
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        mail: {
            type: new DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        password: {
            type: new DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        refreshToken: {
            type: new DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        firstName: {
            type: new DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: new DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },
    {
      tableName: "Users",
      modelName: "User",
      sequelize: db.sequelize,
    }
);

export default User
import {
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    CreationOptional,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManySetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { IMovieComment } from '../types/typesRest';
import sequelize from './db'; // Adjust the import according to your setup
import Movie from './Movie';
import User from "./User";



// Define the Category model
class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<number>; // Primary key with auto-increment
  declare text: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;  
  
  declare getMovie: BelongsToGetAssociationMixin<Movie>; // Note the null assertions!
  declare setMovie: BelongsToSetAssociationMixin<Movie, number>;
  declare createMovie:  BelongsToCreateAssociationMixin<User>;

  declare getUser:  BelongsToGetAssociationMixin<User>;; // Note the null assertions!
  declare setUser: BelongsToSetAssociationMixin <User, number>;
  declare createUser: BelongsToCreateAssociationMixin<User>;
  
}

// Initialize the Category model with actual Sequelize fields
Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      }
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true
  }
);

export default Comment;
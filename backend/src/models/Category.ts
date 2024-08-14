import sequelize from './db'; // Adjust the import according to your setup
import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManyHasAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
  } from "sequelize";
import { ICategory } from '../types/typesRest';
import Movie from './Movie';



// Define the Category model
class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> implements ICategory{
  declare id: CreationOptional<number>; // Primary key with auto-increment
  declare name: string;

  
  declare getMovies: HasManyGetAssociationsMixin<Movie>; // Note the null assertions!
  declare addMovie: HasManyAddAssociationMixin<Movie, number>;
  declare addMovies: HasManyAddAssociationsMixin<Movie, number>;
  declare setMovies: HasManySetAssociationsMixin<Movie, number>;
  declare removeMovie: HasManyRemoveAssociationMixin<Movie, number>;
  declare removeMovies: HasManyRemoveAssociationsMixin<Movie, number>;
  declare hasMovie: HasManyHasAssociationMixin<Movie, number>;
  declare hasMovies: HasManyHasAssociationsMixin<Movie, number>;
  declare countMovies: HasManyCountAssociationsMixin;
  declare createMovie: HasManyCreateAssociationMixin<Movie, 'id'>;
}

// Initialize the Category model with actual Sequelize fields
Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: false
  }
);

export default Category;
import {
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
import Category from "./Category";
import sequelize from "./db";

// Define the Movie model
class Movie
  extends Model<InferAttributes<Movie>, InferCreationAttributes<Movie>>
{
  declare id: CreationOptional<number>; // Assuming you have an auto-incrementing primary key
  declare name: string;
  declare date: string;
  declare country: string;
  declare imageUrl: string;
  declare trailerUrl: string;
  declare description: string;

  declare getCategories: HasManyGetAssociationsMixin<Category>; // Note the null assertions!
  declare addCategory: HasManyAddAssociationMixin<Category, number>;
  declare addCategories: HasManyAddAssociationsMixin<Category, number>;
  declare setCategories: HasManySetAssociationsMixin<Category, number>;
  declare removeCategory: HasManyRemoveAssociationMixin<Category, number>;
  declare removeCategories: HasManyRemoveAssociationsMixin<Category, number>;
  declare hasCategory: HasManyHasAssociationMixin<Category, number>;
  declare hasCategories: HasManyHasAssociationsMixin<Category, number>;
  declare countCategories: HasManyCountAssociationsMixin;
  declare createCategory: HasManyCreateAssociationMixin<Category, 'id'>;
}

// Initialize the Movie model with actual Sequelize fields
Movie.init(
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
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trailerUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Movie",
    tableName: "movies",
    timestamps: false,
  }
);

export default Movie;

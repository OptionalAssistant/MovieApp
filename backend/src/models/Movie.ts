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
import Comment from "./Comment";

// Define the Movie model
class Movie
  extends Model<InferAttributes<Movie>, InferCreationAttributes<Movie>>
{
  declare id: CreationOptional<number>; // Assuming you have an auto-incrementing primary key
  declare name: string;
  declare date:  Date;
  declare country: string;
  declare imageUrl: string;
  declare trailerUrl: string;
  declare description: string;
  declare commentCount: number;
  
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

  declare getComments: HasManyGetAssociationsMixin<Comment>; // Note the null assertions!
  declare addComment: HasManyAddAssociationMixin<Comment, number>;
  declare addComments: HasManyAddAssociationsMixin<Comment, number>;
  declare setComments: HasManySetAssociationsMixin<Comment, number>;
  declare removeComment: HasManyRemoveAssociationMixin<Comment, number>;
  declare removeComments: HasManyRemoveAssociationsMixin<Comment, number>;
  declare hasComment: HasManyHasAssociationMixin<Comment, number>;
  declare hasComments: HasManyHasAssociationsMixin<Comment, number>;
  declare countComments: HasManyCountAssociationsMixin;
  declare createComments: HasManyCreateAssociationMixin<Comment, 'id'>;
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
      type: DataTypes.DATE,
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
    commentCount:{
      type: DataTypes.INTEGER,
      defaultValue:0
    }
  },
  {
    sequelize,
    modelName: "Movie",
    tableName: "movies",
    timestamps: false,
  }
);

export default Movie;

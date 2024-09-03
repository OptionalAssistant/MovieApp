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
import User from "./User";
import Person from "./Person";

// Define the Movie model
class Movie extends Model<
  InferAttributes<Movie>,
  InferCreationAttributes<Movie>
> {
  declare id: CreationOptional<number>; // Assuming you have an auto-incrementing primary key
  declare name: string;
  declare date: Date;
  declare country: string;
  declare imageUrl: string;
  declare trailerUrl: string;
  declare description: string;
  declare commentCount: number;
  declare likesCount: number;

  
  declare getCategories: HasManyGetAssociationsMixin<Category>; // Note the null assertions!
  declare addCategory: HasManyAddAssociationMixin<Category, number>;
  declare addCategories: HasManyAddAssociationsMixin<Category, number>;
  declare setCategories: HasManySetAssociationsMixin<Category, number>;
  declare removeCategory: HasManyRemoveAssociationMixin<Category, number>;
  declare removeCategories: HasManyRemoveAssociationsMixin<Category, number>;
  declare hasCategory: HasManyHasAssociationMixin<Category, number>;
  declare hasCategories: HasManyHasAssociationsMixin<Category, number>;
  declare countCategories: HasManyCountAssociationsMixin;
  declare createCategory: HasManyCreateAssociationMixin<Category, "id">;

  declare getComments: HasManyGetAssociationsMixin<Comment>; // Note the null assertions!
  declare addComment: HasManyAddAssociationMixin<Comment, number>;
  declare addComments: HasManyAddAssociationsMixin<Comment, number>;
  declare setComments: HasManySetAssociationsMixin<Comment, number>;
  declare removeComment: HasManyRemoveAssociationMixin<Comment, number>;
  declare removeComments: HasManyRemoveAssociationsMixin<Comment, number>;
  declare hasComment: HasManyHasAssociationMixin<Comment, number>;
  declare hasComments: HasManyHasAssociationsMixin<Comment, number>;
  declare countComments: HasManyCountAssociationsMixin;
  declare createComments: HasManyCreateAssociationMixin<Comment, "id">;

  declare getLikedByUsers: HasManyGetAssociationsMixin<User>;
  declare addLikedByUser: HasManyAddAssociationMixin<User, number>;
  declare addLikedByUsers: HasManyAddAssociationsMixin<User, number>;
  declare setLikedByUsers: HasManySetAssociationsMixin<User, number>;
  declare removeLikedByUser: HasManyRemoveAssociationMixin<User, number>;
  declare removeLikedByUsers: HasManyRemoveAssociationsMixin<User, number>;
  declare hasLikedByUser: HasManyHasAssociationMixin<User, number>;
  declare hasLikedByUsers: HasManyHasAssociationsMixin<User, number>;
  declare countLikedByUsers: HasManyCountAssociationsMixin;
  declare createLikedByUser: HasManyCreateAssociationMixin<User, 'id'>;

  declare getDislikedByUsers: HasManyGetAssociationsMixin<User>;
  declare addDislikedByUser: HasManyAddAssociationMixin<User, number>;
  declare addDislikedByUsers: HasManyAddAssociationsMixin<User, number>;
  declare setDislikedByUsers: HasManySetAssociationsMixin<User, number>;
  declare removeDislikedByUser: HasManyRemoveAssociationMixin<User, number>;
  declare removeDislikedByUsers: HasManyRemoveAssociationsMixin<User, number>;
  declare hasDislikedByUser: HasManyHasAssociationMixin<User, number>;
  declare hasDislikedByUsers: HasManyHasAssociationsMixin<User, number>;
  declare countDislikedByUsers: HasManyCountAssociationsMixin;
  declare createDislikedByUser: HasManyCreateAssociationMixin<User, 'id'>;

  declare getDirectors: HasManyGetAssociationsMixin<Person>;
  declare addDirector: HasManyAddAssociationMixin<Person, number>;
  declare addDirectors: HasManyAddAssociationsMixin<Person, number>;
  declare setDirectors: HasManySetAssociationsMixin<Person, number>;
  declare removeDirector: HasManyRemoveAssociationMixin<Person, number>;
  declare removeDirectors: HasManyRemoveAssociationsMixin<Person, number>;
  declare hasDirector: HasManyHasAssociationMixin<Person, number>;
  declare hasDirectors: HasManyHasAssociationsMixin<Person, number>;
  declare countDirectors: HasManyCountAssociationsMixin;
  declare createDirector: HasManyCreateAssociationMixin<Person, 'id'>;

  // Methods for Actors
  declare getActors: HasManyGetAssociationsMixin<Person>;
  declare addActor: HasManyAddAssociationMixin<Person, number>;
  declare addActors: HasManyAddAssociationsMixin<Person, number>;
  declare setActors: HasManySetAssociationsMixin<Person, number>;
  declare removeActor: HasManyRemoveAssociationMixin<Person, number>;
  declare removeActors: HasManyRemoveAssociationsMixin<Person, number>;
  declare hasActor: HasManyHasAssociationMixin<Person, number>;
  declare hasActors: HasManyHasAssociationsMixin<Person, number>;
  declare countActors: HasManyCountAssociationsMixin;
  declare createActor: HasManyCreateAssociationMixin<Person, 'id'>;
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
      allowNull: true,
    },
    trailerUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    commentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    likesCount:{
      type: DataTypes.INTEGER,
      defaultValue: 0,
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

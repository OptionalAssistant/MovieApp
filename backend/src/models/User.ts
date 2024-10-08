import sequelize from "./db";
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { IUser } from "../types/typesClient";

import {
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin
} from "sequelize";

import Comment from "./Comment";
import Movie from "./Movie";
// Define the User model, using IUser for the user property
class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements IUser
{
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare isActivated: boolean;
  declare roles: "USER" | "ADMIN"; // TypeScript type annotation
  declare avatar: string;

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


  declare getLikedMovies: HasManyGetAssociationsMixin<Movie>;
  declare addLikedMovie: HasManyAddAssociationMixin<Movie, number>;
  declare addLikedMovies: HasManyAddAssociationsMixin<Movie, number>;
  declare removeLikedMovie: HasManyRemoveAssociationMixin<Movie, number>;
  declare removeLikedMovies: HasManyRemoveAssociationsMixin<Movie, number>;

  declare getDislikedMovies: HasManyGetAssociationsMixin<Movie>;
  declare addDislikedMovie: HasManyAddAssociationMixin<Movie, number>;
  declare addDislikedMovies: HasManyAddAssociationsMixin<Movie, number>;
  declare removeDislikedMovie: HasManyRemoveAssociationMixin<Movie, number>;
  declare removeDislikedMovies: HasManyRemoveAssociationsMixin<Movie, number>;
}

// Initialize the User model with actual Sequelize fields
User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    roles: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      defaultValue: "ADMIN",
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);

export default User;

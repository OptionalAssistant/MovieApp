import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import Category from "./Category";
import Movie from "./Movie";
import  sequelize  from "./db";


class CategoryMovie extends Model<
  InferAttributes<CategoryMovie>,
  InferCreationAttributes<CategoryMovie>
> {
  declare MovieId: number;
  declare CategoryId: number;
}

CategoryMovie.init(
  {
    MovieId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Movie,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "ActorMovies",
    tableName: "actor_movies",
    timestamps: false
  }
);


export default CategoryMovie;
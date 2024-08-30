import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import Category from "./Category";
import Movie from "./Movie";
import  sequelize  from "./db";
import Person from './Person';


class DirectorMovie extends Model<
  InferAttributes<DirectorMovie>,
  InferCreationAttributes<DirectorMovie>
> {
  declare MovieId: number;
  declare PersonId: number;
}

DirectorMovie.init(
  {
    MovieId: {
      type: DataTypes.INTEGER,
      references: {
        model: Movie,
        key: "id",
      },
      allowNull: false
    },
    PersonId: {
      type: DataTypes.INTEGER,
      references: {
        model: Person,
        key: "id",
      },
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: "MoviePersonDirector",
    tableName: "MoviesPersonsDirectors",
    timestamps: false
  }
);


export default DirectorMovie;
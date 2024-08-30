import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import Category from "./Category";
import Movie from "./Movie";
import  sequelize  from "./db";
import Person from './Person';


class ActorMovie extends Model<
  InferAttributes<ActorMovie>,
  InferCreationAttributes<ActorMovie>
> {
  declare MovieId: number;
  declare PersonId: number;
}

ActorMovie.init(
  {
    MovieId: {
      type: DataTypes.INTEGER,
      references: {
        model: Movie,
        key: "id",
      },
    },
    PersonId: {
      type: DataTypes.INTEGER,
      references: {
        model: Person,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "MoviePersonActor",
    tableName: "MoviesPersonsActors",
    timestamps: false
  }
);


export default ActorMovie;
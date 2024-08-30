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
    Model
} from "sequelize";
import sequelize from './db'; // Adjust the import according to your setup
import Movie from './Movie';




class Person extends Model<InferAttributes<Person>, InferCreationAttributes<Person>> {
  declare id: CreationOptional<number>; // Primary key with auto-increment
  declare date: Date;
  declare birthplace: string;
  declare name: string;
  declare tall: string;
  declare avatarUrl: string;

  declare getDirectedMovies: HasManyGetAssociationsMixin<Movie>; 
  declare addDirectedMovie: HasManyAddAssociationMixin<Movie, number>;
  declare addDirectedMovies: HasManyAddAssociationsMixin<Movie, number>;
  declare setDirectedMovies: HasManySetAssociationsMixin<Movie, number>;
  declare removeDirectedMovie: HasManyRemoveAssociationMixin<Movie, number>;
  declare removeDirectedMovies: HasManyRemoveAssociationsMixin<Movie, number>;
  declare hasDirectedMovie: HasManyHasAssociationMixin<Movie, number>;
  declare hasDirectedMovies: HasManyHasAssociationsMixin<Movie, number>;
  declare countDirectedMovies: HasManyCountAssociationsMixin;
  declare createDirectedMovie: HasManyCreateAssociationMixin<Movie, 'id'>;

  // Methods for Movies associated through Actor relationship
  declare getActedMovies: HasManyGetAssociationsMixin<Movie>;
  declare addActedMovie: HasManyAddAssociationMixin<Movie, number>;
  declare addActedMovies: HasManyAddAssociationsMixin<Movie, number>;
  declare setActedMovies: HasManySetAssociationsMixin<Movie, number>;
  declare removeActedMovie: HasManyRemoveAssociationMixin<Movie, number>;
  declare removeActedMovies: HasManyRemoveAssociationsMixin<Movie, number>;
  declare hasActedMovie: HasManyHasAssociationMixin<Movie, number>;
  declare hasActedMovies: HasManyHasAssociationsMixin<Movie, number>;
  declare countActedMovies: HasManyCountAssociationsMixin;
  declare createActedMovie: HasManyCreateAssociationMixin<Movie, 'id'>;
}


Person.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      birthplace: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tall: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name:{
        type: DataTypes.STRING,
        allowNull: false
      },
      avatarUrl:{
        type: DataTypes.STRING,
        allowNull: true
      }
  },
  {
    sequelize,
    modelName: 'Person',
    tableName: 'persons',
    timestamps: true
  }
);

export default Person;
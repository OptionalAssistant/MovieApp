import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
  } from 'sequelize';
  import sequelize from './db';
  import Movie from './Movie';
  import User from './User';
  
  class MovieDislikes extends Model<InferAttributes<MovieDislikes>, InferCreationAttributes<MovieDislikes>> {
    declare MovieId: number;
    declare UserId: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }
  
  MovieDislikes.init(
    {
      MovieId: {
        type: DataTypes.INTEGER,
        references: {
          model: Movie,
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      },
    },
    {
      sequelize,
      modelName: 'MovieDislikes',
      tableName: 'MovieDislikes',
      timestamps: true, // Automatically handles `createdAt` and `updatedAt` fields
    }
  );
  
  export default MovieDislikes;
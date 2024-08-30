'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MoviesPersonsDirectors', {
      MovieId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'movies', // The table name of the Movie model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      PersonId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'persons', // The table name of the Person model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MoviesPersonsDirectors');
  },
};
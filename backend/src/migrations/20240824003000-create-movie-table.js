

module.exports = {
  up: async (queryInterface,Sequelize) => {
    await queryInterface.createTable('movies', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      trailerUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      commentCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('movies');
  },
};


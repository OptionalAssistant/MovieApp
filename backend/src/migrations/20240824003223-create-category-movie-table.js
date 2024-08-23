

module.exports = {
  up: async (queryInterface,Sequelize) => {
    await queryInterface.createTable('category_movies', {
      MovieId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'movies', // This should match the table name of your Movie model
          key: 'id',
        },
        onDelete: 'CASCADE', // Optional: specify action on delete
        onUpdate: 'CASCADE', // Optional: specify action on update
      },
      CategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories', // This should match the table name of your Category model
          key: 'id',
        },
        onDelete: 'CASCADE', // Optional: specify action on delete
        onUpdate: 'CASCADE', // Optional: specify action on update
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('category_movies');
  },
};


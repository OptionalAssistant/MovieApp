

module.exports = {
  up: async (queryInterface,Sequelize) => {
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensure category names are unique
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('categories');
  },
};


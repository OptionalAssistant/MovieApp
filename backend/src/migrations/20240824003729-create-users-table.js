

module.exports = {
  up: async (queryInterface,Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensure email addresses are unique
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isActivated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      roles: {
        type: Sequelize.ENUM("USER", "ADMIN"),
        defaultValue: "ADMIN",
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
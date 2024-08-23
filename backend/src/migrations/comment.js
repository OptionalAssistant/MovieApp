const { DataTypes } = require('sequelize');

module.exports =  {
  up: async (queryInterface) => {
    await queryInterface.createTable('comments', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      MovieId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'movies', // This should match the table name of your Movie model
          key: 'id',
        },
        onDelete: 'CASCADE', // Optional: specify action on delete
        onUpdate: 'CASCADE', // Optional: specify action on update
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users', // This should match the table name of your User model
          key: 'id',
        },
        onDelete: 'CASCADE', // Optional: specify action on delete
        onUpdate: 'CASCADE', // Optional: specify action on update
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('comments');
  },
};


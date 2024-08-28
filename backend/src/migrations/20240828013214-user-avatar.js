'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'avatar', { type: Sequelize.STRING ,allowNull: true});
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'avatar');
  }
};

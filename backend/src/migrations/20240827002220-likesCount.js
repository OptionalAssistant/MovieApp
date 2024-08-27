'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('movies', 'likesCount', { type: Sequelize.INTEGER ,defaultValue: 0,allowNull:false});
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('movies', 'likesCount');
  }
};

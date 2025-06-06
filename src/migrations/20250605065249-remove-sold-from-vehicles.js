'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('vehicles', 'sold');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('vehicles', 'sold', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  }
};

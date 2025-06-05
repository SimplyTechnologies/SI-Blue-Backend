'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('vehicles', { fields: ['vin', 'deletedAt'], type: 'unique' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('vehicles', { fields: ['vin', 'deletedAt'], type: 'unique' });
  },
};
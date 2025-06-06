'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('vehicles', 'vehicles_vin_key');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('vehicles', {
      fields: ['vin'],
      type: 'unique',
      name: 'vehicles_vin_key'
    });
  },
};


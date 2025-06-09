'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addConstraint('users', {
      fields: ['email', 'deleted_at'],
      type: 'unique'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint('users', { fields: ['email', 'deleted_at'], type: 'unique' });
  },
};

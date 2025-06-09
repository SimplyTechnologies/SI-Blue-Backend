const makes = require('../data/initial-makes.js');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('makes', makes, {});
  },
  down: async queryInterface => {
    await queryInterface.bulkDelete('makes', {}, {});
  },
};

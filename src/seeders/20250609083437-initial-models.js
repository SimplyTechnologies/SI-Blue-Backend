const models = require('../data/initial-models.js');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('models', models, {});
  },
  down: async queryInterface => {
    await queryInterface.bulkDelete('models', {}, {});
  },
};

const { Sequelize } = require("sequelize");


module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('users', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });


  },

  down: async (queryInterface) => {

    await queryInterface.removeColumn('users', 'deleted_at');
  },
};
const { Sequelize } = require("sequelize");


module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('vehicles', 'assignedDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('vehicles', 'assignedDate');
  },
};
const { DataTypes } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.addColumn('users', 'tokenInvalidatedAt', {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },
  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'tokenInvalidatedAt');
  },
};

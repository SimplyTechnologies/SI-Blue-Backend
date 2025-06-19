const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    await queryInterface.createTable('userActivity', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      modelType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      actionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      previousValue: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      currentValue: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('userActivity');
  },
};


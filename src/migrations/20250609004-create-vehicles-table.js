const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    await queryInterface.createTable('vehicles', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      year: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      vin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      assignedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      modelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'models',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'customers',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });
    await queryInterface.addIndex('vehicles', ['vin', 'deletedAt'], {
      unique: true,
      name: 'vehicles_vin_deletedAt_unique',
    });
  },
  down: async queryInterface => {
    await queryInterface.removeIndex('vehicles', 'vehicles_vin_deletedAt_unique');
    await queryInterface.dropTable('vehicles');
  },
};

const { DataTypes } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable('models', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      makeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'makes',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('models');
  },
};

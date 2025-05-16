const { Model, DataTypes } = require('sequelize');

class Make extends Model {
  static initModel(sequelize) {
    Make.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Make',
        tableName: 'makes',
        timestamps: true,
      },
    );
  }
}

module.exports = Make;

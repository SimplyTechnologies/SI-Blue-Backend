import { Model, DataTypes } from 'sequelize';
const { Vehicle } = require('./vehiclesModel');

class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: {
          type: DataTypes.TEXT,
          unique: true,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        userName: {
          type: DataTypes.TEXT,
          unique: true,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        carId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Vehicle,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },

        role: {
          type: DataTypes.ENUM('user', 'superadmin'),
          defaultValue: 'user',
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
      },
    );
  }
}

export { User };

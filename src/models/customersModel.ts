import { Model, DataTypes } from 'sequelize';

class Customer extends Model {
  static initModel(sequelize) {
    Customer.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        surname: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Customer',
        tableName: 'customers',
        timestamps: true,
      },
    );
  }
}

export { Customer };

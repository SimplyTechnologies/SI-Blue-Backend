import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface CustomerAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'id'> {}

export class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phoneNumber!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
}

export const defineCustomerModel = (sequelize: Sequelize): typeof Customer => {
  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'customers',
      timestamps: true,
      paranoid: true,
      underscored: false,
    },
  );

  return Customer;
};

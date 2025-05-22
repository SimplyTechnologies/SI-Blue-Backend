import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { Vehicle } from './vehiclesModel';

export interface CustomerAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  vehicleId: number;
}
export interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'id'> {}

export class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public phone_number!: string;
  public vehicleId!: number;

  public getFullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}

export const defineCustomerModel = (sequelize: Sequelize): typeof Customer => {
  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
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
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Vehicle,
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      tableName: 'customers',
      timestamps: false,
      underscored: false,
    },
  );

  return Customer;
};

export type CustomerModelType = typeof Customer;

import { DataTypes } from "sequelize";

let Customer
const defineCustomerModel =  (sequelize) => {

   Customer = sequelize.define(
    'Customer',
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
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
    },
    {
      tableName: 'customers',
      timestamps: false,
      underscored: false,
    }
  );
};

export { defineCustomerModel, Customer };





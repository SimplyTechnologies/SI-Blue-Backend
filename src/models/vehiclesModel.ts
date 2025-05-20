
import { DataTypes } from "sequelize";
import { Make } from "./carMakesModel";
import { User } from "./usersModel";
import { Customer } from "./customersModel";
import { CarModel } from "./carModelsModel";

let Vehicle
const defineVehicleModel =  (sequelize) => {

  Vehicle = sequelize.define(
    'Vehicle',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      year: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      vin: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false
      },
      zipcode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sold: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      makeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: Make,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User, 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Customer,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      modelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: CarModel,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 'vehicle',
      timestamps: false,
      underscored: false,
    }
  );
};

export { defineVehicleModel, Vehicle };


















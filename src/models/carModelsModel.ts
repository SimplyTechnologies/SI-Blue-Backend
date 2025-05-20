import { DataTypes } from "sequelize";
import { Make } from "./carMakesModel";

let CarModel
const defineCarModel =  (sequelize) => {

  CarModel = sequelize.define(
    'CarModel',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      makeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: Make,
        key: 'id',
      },
      onDelete: 'CASCADE',

      }
      ,
    },
    {
      tableName: 'car_model',
      timestamps: false,
      underscored: false,
    }
  );
};

export { defineCarModel, CarModel };








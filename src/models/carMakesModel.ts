import { DataTypes } from "sequelize";

let Make
const defineMakeModel =  (sequelize) => {

   Make = sequelize.define(
    'Make',
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
    },
    {
      tableName: 'makes',
      timestamps: false,
      underscored: false,
    }
  );
};

export { defineMakeModel, Make };




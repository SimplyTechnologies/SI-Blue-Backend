import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { Make } from './carMakesModel';

export interface CarModelAttributes {
  id: number;
  name: string;
  makeId: number;
}

export interface CarModelCreationAttributes extends Optional<CarModelAttributes, 'id'> {}

export class CarModel extends Model<CarModelAttributes, CarModelCreationAttributes> implements CarModelAttributes {
  public id!: number;
  public name!: string;
  public makeId!: number;
  public make?: Make;
}

export const defineCarModel = (sequelize: Sequelize): typeof CarModel => {
  CarModel.init(
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
          model: 'makes',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      tableName: 'models',
      timestamps: false,
      underscored: false,
    },
  );

  return CarModel;
};

import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { Make } from './carMakesModel';

export interface CarModelAttributes {
  id: number;
  name: string;
  makeId: number;
}
export interface CarModelAttributesWithoutId {
  name: string;
  makeId: number;
}

export interface CarModelCreationAttributes extends Optional<CarModelAttributes, 'id'> {}

export class CarModel extends Model<CarModelAttributes, CarModelCreationAttributes> implements CarModelAttributes {
  public id!: number;
  public name!: string;
  public makeId!: number;
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
          model: Make,
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      tableName: 'car_model',
      timestamps: false,
      underscored: false,
    },
  );

  return CarModel;
};

export type CarModelType = typeof CarModel;

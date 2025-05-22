import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface MakeAttributes {
  id: number;
  name: string;
}
export interface MakeCreationAttributes extends Optional<MakeAttributes, 'id'> {}

export class Make extends Model<MakeAttributes, MakeCreationAttributes> implements MakeAttributes {
  public id!: number;
  public name!: string;
}

export const defineMakeModel = (sequelize: Sequelize): typeof Make => {
  Make.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      tableName: 'makes',
      timestamps: false,
      underscored: false,
    },
  );

  return Make;
};

export type MakeModelType = typeof Make;

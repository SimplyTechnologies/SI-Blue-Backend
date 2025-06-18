import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { User } from './usersModel';

const ModelType = {
  VEHICLE: 'vehicle',
  CUSTOMER: 'customer',
} as const;

const ActionType = {
  DELETE: 'DELETE',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
} as const;

export type ModelType = (typeof ModelType)[keyof typeof ModelType];
export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export interface UserActivityAttributes {
  id: number;
  userId: number;
  modelType: ModelType;
  actionType: ActionType;
  previousValue: string;
  currentValue: string;
}
export interface UserCreationAttributes extends Optional<UserActivityAttributes, 'id'> {}

export class UserActivity
  extends Model<UserActivityAttributes, UserCreationAttributes>
  implements UserActivityAttributes
{
  public id!: number;
  public userId!: number;
  public modelType!: ModelType;
  public actionType!: ActionType;
  public previousValue!: string;
  public currentValue!: string;
}

export const defineUserActivityModel = (sequelize: Sequelize): typeof UserActivity => {
  UserActivity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
      modelType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      actionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      previousValue: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      currentValue: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'userActivity',
      timestamps: true,
      underscored: false,
    },
  );

  return UserActivity;
};

export type UserActivityModelType = typeof UserActivity;


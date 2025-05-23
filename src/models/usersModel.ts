import { DataTypes, Model, Sequelize } from 'sequelize';
import { Vehicle } from './vehiclesModel';

export type UserRole = 'user' | 'superadmin';

export interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: UserRole;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public phone_number!: string;
  public password!: string;
  public role!: UserRole;

  static associate() {
    User.belongsToMany(Vehicle, {
      through: 'FavoriteVehicles',
      as: 'favoriteVehicles',
      foreignKey: 'userId',
      otherKey: 'vehicleId',
    });
  }
}

export const defineUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
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
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'superadmin'),
        allowNull: false,
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false,
      underscored: false,
    },
  );

  return User;
};

export type UserModelType = typeof User;

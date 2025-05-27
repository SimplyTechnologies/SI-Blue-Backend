import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserRoleType } from '../schemas/usersSchema';
import { Vehicle } from './vehiclesModel';

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRoleType;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phoneNumber: string;
  declare password: string;
  declare role: UserRoleType;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate() {
    User.belongsToMany(Vehicle, {
      through: 'favorites',
      as: 'favorite',
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
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'last_name',
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: false,
        field: 'phone_number',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'superadmin'),
        allowNull: false,
        defaultValue: 'user',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      underscored: true,
      indexes: [{ unique: true, fields: ['email'] }, { fields: ['role'] }, { fields: ['is_active'] }],
    },
  );

  return User;
};

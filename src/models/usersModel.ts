import {
  DataTypes,
  Model,
  Sequelize,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import { UserRoleType } from '../schemas/usersSchema';
import { Vehicle } from './vehiclesModel';

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string | null;
  role: UserRoleType;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phoneNumber!: string;
  public password!: string | null;
  public role!: UserRoleType;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;
  public addFavorite!: BelongsToManyAddAssociationMixin<Vehicle, number>;
  public getFavorite!: BelongsToManyGetAssociationsMixin<Vehicle>;
  public removeFavorite!: BelongsToManyAddAssociationMixin<Vehicle, number>;
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
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        unique:true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      role: {
        type: DataTypes.ENUM('user', 'superadmin'),
        allowNull: false,
        defaultValue: 'user',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      underscored: false,
      paranoid: true,
      
    },
  );

  return User;
};

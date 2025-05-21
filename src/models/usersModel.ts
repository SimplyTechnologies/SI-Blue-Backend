import { DataTypes } from "sequelize";

let User
const defineUserModel =  (sequelize) => {

   User = sequelize.define(
    'User',
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
        defaultValue: 'user'
      }
    },
    {
      tableName: 'users',
      timestamps: false,
      underscored: false,
    }
  );
};

export { defineUserModel, User };

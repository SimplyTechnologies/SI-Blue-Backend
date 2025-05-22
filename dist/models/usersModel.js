import { DataTypes, Model } from 'sequelize';
export class User extends Model {
}
export const defineUserModel = (sequelize) => {
    User.init({
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
    }, {
        sequelize,
        tableName: 'users',
        timestamps: false,
        underscored: false,
    });
    return User;
};
//# sourceMappingURL=usersModel.js.map
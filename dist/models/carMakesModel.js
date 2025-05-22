import { DataTypes, Model } from 'sequelize';
export class Make extends Model {
}
export const defineMakeModel = (sequelize) => {
    Make.init({
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
    }, {
        sequelize,
        tableName: 'makes',
        timestamps: false,
        underscored: false,
    });
    return Make;
};
//# sourceMappingURL=carMakesModel.js.map
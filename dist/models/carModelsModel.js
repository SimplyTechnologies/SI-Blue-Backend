import { DataTypes, Model } from 'sequelize';
import { Make } from './carMakesModel';
export class CarModel extends Model {
}
export const defineCarModel = (sequelize) => {
    CarModel.init({
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
    }, {
        sequelize,
        tableName: 'car_model',
        timestamps: false,
        underscored: false,
    });
    return CarModel;
};
//# sourceMappingURL=carModelsModel.js.map
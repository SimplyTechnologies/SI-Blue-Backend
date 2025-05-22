import { DataTypes, Model } from 'sequelize';
import { User } from './usersModel';
import { CarModel } from './carModelsModel';
class Vehicle extends Model {
}
const defineVehicleModel = (sequelize) => {
    Vehicle.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        year: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        vin: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        location: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                isValidLocation(value) {
                    if (!value.street || !value.city || !value.state || !value.zipcode || !value.country) {
                        throw new Error('Location must include street, city, state, zipcode, and country');
                    }
                },
            },
            get() {
                return this.getDataValue('location');
            },
            set(value) {
                this.setDataValue('location', value);
            },
        },
        sold: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        modelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: CarModel,
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    }, {
        sequelize,
        tableName: 'vehicle',
        timestamps: false,
        underscored: false,
    });
    return Vehicle;
};
export { defineVehicleModel, Vehicle };
//# sourceMappingURL=vehiclesModel.js.map
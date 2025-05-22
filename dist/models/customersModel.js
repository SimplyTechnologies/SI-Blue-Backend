import { DataTypes, Model } from 'sequelize';
import { Vehicle } from './vehiclesModel';
export class Customer extends Model {
    getFullName() {
        return `${this.first_name} ${this.last_name}`;
    }
}
export const defineCustomerModel = (sequelize) => {
    Customer.init({
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
            validate: {
                isEmail: true,
            },
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Vehicle,
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    }, {
        sequelize,
        tableName: 'customers',
        timestamps: false,
        underscored: false,
    });
    return Customer;
};
//# sourceMappingURL=customersModel.js.map
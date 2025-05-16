const { Model, DataTypes } = require("sequelize")
const { Customer } = require("./customersModel")

class Vehicle extends Model {
    static initModel(sequelize) {
        Vehicle.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                year: {
                    type: DataTypes.SMALLINT,
                    allowNull: false

                },
                vin: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                customerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                      model: Customer,
                      key: "id",
                    },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                  },
                modelId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: Model,
                        key: "id"
                    },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE"
                }
            },
            {
                sequelize,
                modelName: "Vehicle",
                tableName: "vehicles",
                timestamps: true,
            }
           )
    }
}

module.exports = Vehicle
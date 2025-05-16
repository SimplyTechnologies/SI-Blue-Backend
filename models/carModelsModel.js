const { Model, DataTypes } = require("sequelize")
const Make = require("./carMakesModel")

class carModel extends Model {
    static initModel(sequelize) {
        Model.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false
                },
                name: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                makeId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: Make,
                        key: "id"
                    },
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE"
                }
            },
            {
                sequelize,
                modelName: "Model",
                tableName: "models",
                timestamps: true

            }
        )

    }
}

module.exports = carModel
import { Model, DataTypes } from "sequelize"
import {Make} from "./carMakesModel"

class carModel extends Model {
    static initModel(sequelize) {
        carModel.init(
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

export {
    carModel
}

import { User } from "./usersModel"
import { Vehicle } from "./vehiclesModel"
import { Customer } from "./customersModel"
import { Make  } from "./carMakesModel"
import { carModel } from "./carModelsModel"

import connectToDB from "../configs/database"

const initModels = async () => {
    const sequelize = await connectToDB()

  if (!sequelize) {
    throw new Error("Sequelize instance is undefined")
  }
//   User.initModel(sequelize)
//   Vehicle.initModel(sequelize)
//   Customer.initModel(sequelize)
//   Make.initModel(sequelize)
//   Model.initModel(sequelize)

}

export  {
  initModels
}
const User = require("./usersModel")
const Vehicle = require("./vehiclesModel")
const Customer = require("./customersModel")
const Make = require("./carMakesModel")
const Model = require("./carModelsModel")

const connectToDB = require("../configs/database")

const initModels = async () => {
    const sequelize = await connectToDB()

  if (!sequelize) {
    throw new Error("Sequelize instance is undefined")
  }
  User.initModel(sequelize)
  Vehicle.initModel(sequelize)
  Customer.initModel(sequelize)
  Make.initModel(sequelize)
  Model.initModel(sequelize)

}

module.exports = initModels
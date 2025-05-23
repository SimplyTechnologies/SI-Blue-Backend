import { Make } from "../models/carMakesModel"
import { CarModel } from "../models/carModelsModel"
import { Op } from "sequelize"

const getMakeById = async (id: number) => {
    const make = await CarModel.findByPk(id)
    if(!make){
        return null
    }
    console.log('service', make)
    

}
const getMakeByName = async (name: string) => {
   const make = await Make.findOne({where: {name}})
   return make?.dataValues
  };

const createMake = async (make: string) => {
    
    const created = await Make.create({name: make})
   
   
    return created

}

export default {
    getMakeById,
    createMake,
    getMakeByName
}
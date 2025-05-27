import { Make } from '../models/carMakesModel';
import { CarModel } from '../models/carModelsModel';

const getAllMakes = async () => {
  return await Make.findAll();
};

const getMakeById = async (id: number) => {
  const make = await CarModel.findByPk(id);
  if (!make) {
    return null;
  }
  console.log('service', make);
};
const getMakeByName = async (name: string) => {
  const make = await Make.findOne({ where: { name } });
  return make?.dataValues;
};

const createMake = async (make: string) => {
  return await Make.create({ name: make });
};

export default {
  getAllMakes,
  getMakeById,
  createMake,
  getMakeByName,
};

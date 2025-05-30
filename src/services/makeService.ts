import { Op } from 'sequelize';
import { Make } from '../models/carMakesModel';
import { CarModel } from '../models/carModelsModel';

const getAllMakes = async () => {
  return await Make.findAll({ order: [['name', 'ASC']] });
};

const getMakeById = async (id: number) => {
  const make = await CarModel.findByPk(id);
  if (!make) {
    return null;
  }
  return make;
};
export const getMakeByName = async (name: string) => {
  return await Make.findOne({
    where: {
      name: {
        [Op.iLike]: name,
      },
    },
  });
};

const createMake = async (make: string) => {
  const createdMake = await Make.create({ name: make });
  return createdMake.dataValues;
};

export default {
  getAllMakes,
  getMakeById,
  createMake,
  getMakeByName,
};

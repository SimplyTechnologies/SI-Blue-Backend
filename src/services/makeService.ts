import { Op } from 'sequelize';
import { Make } from '../models/carMakesModel';
import { CarModel } from '../models/carModelsModel';

const getAllMakes = async () => {
  try {
    return await Make.findAll({ order: [['name', 'ASC']] });
  } catch (err) {
    console.error('Failed to get all makes', err);
    throw err;
  }
};

const getMakeById = async (id: number) => {
  try {
    if (!id) {
      throw new Error('Id is required');
    }
    const make = await CarModel.findByPk(id);
    if (!make) {
      return null;
    }
    return make;
  } catch (err) {
    console.error('Failed to get make by Id', err);
    throw err;
  }
};

export const getMakeByName = async (name: string) => {
  try {
    if (!name) {
      throw new Error('Name is required');
    }
    return await Make.findOne({
      where: {
        name: {
          [Op.iLike]: name,
        },
      },
    });
  } catch (err) {
    console.error('Failed to get make by name');
    throw err;
  }
};

const createMake = async (make: string) => {
  try {
    if (!make) {
      throw new Error('Make is required');
    }
    const createdMake = await Make.create({ name: make });
    return createdMake.dataValues;
  } catch (err) {
    console.error('Failed to create make', err);
    throw err;
  }
};

export default {
  getAllMakes,
  getMakeById,
  createMake,
  getMakeByName,
};


import { CarModel } from '../models/carModelsModel';
import { InferCreationAttributes } from 'sequelize';

type CarModelCreationAttributes = InferCreationAttributes<CarModel>;

const createModel = async (modelData: Omit<CarModelCreationAttributes, 'id'>) => {
  const created = await CarModel.create({
    name: modelData.name,
    makeId: modelData.makeId,
  });
  return created.dataValues;
};

const getModelById = async (id: number) => {
  const founded = await CarModel.findByPk(id);
  return founded?.dataValues;
};

const getModelByName = async (name: string) => {
  const founded = await CarModel.findOne({ where: { name } });
  return founded?.dataValues;
};

const getModelsByMakeId = async (makeId: number) => {
  return await CarModel.findAll({ where: { makeId } });
};

export default {
  createModel,
  getModelById,
  getModelByName,
  getModelsByMakeId,
};

import { CarModel } from '../models/carModelsModel';
import { InferCreationAttributes } from 'sequelize';

type CarModelCreationAttributes = InferCreationAttributes<CarModel>;

const createModel = async (modelData: Omit<CarModelCreationAttributes, 'id'>) => {
  try {
    if (!modelData.name || !modelData.makeId) {
      throw new Error('Name and MakeId are required');
    }
    const created = await CarModel.create({
      name: modelData.name,
      makeId: modelData.makeId,
    });
    return created.dataValues;
  } catch (err) {
    console.error('Failed to create car model', err);
    throw err;
  }
};

const getModelById = async (id: number) => {
  try {
    if (!id) {
      throw new Error('Valid ID is required');
    }
    const founded = await CarModel.findByPk(id);
    return founded?.dataValues;
  } catch (err) {
    console.error('Failed to get model by Id', err);
    throw err;
  }
};

const getModelByName = async (name: string) => {
  try {
    if (!name.trim()) {
      throw new Error('Name is required');
    }
    const founded = await CarModel.findOne({ where: { name } });
    return founded?.dataValues;
  } catch (err) {
    console.error('Failed to get model by name', err);
    throw err;
  }
};

const getModelsByMakeId = async (makeId: number) => {
  try {
    if (!makeId) {
      throw new Error('Make Id is required');
    }
    return await CarModel.findAll({
      where: { makeId },
      order: [['name', 'ASC']],
    });
  } catch (err) {
    console.error('Failed to get make by Id', err);
    throw err;
  }
};

export default {
  createModel,
  getModelById,
  getModelByName,
  getModelsByMakeId,
};

// import { InferCreationAttributes } from 'sequelize';

// type CarModelCreationAttributes = InferCreationAttributes<CarModel>;

// const createModel = async (modelData: Omit<CarModelCreationAttributes, 'id'>) => {
//   try {
//     if (!modelData.name || !modelData.makeId) {
//       throw new Error('Name and makeId are required');
//     }

//     const created = await CarModel.create(modelData);
//     return created; // Return instance, not dataValues

//   } catch(err: any){
//     console.error('Failed to create car model:', err);

//     // Handle specific Sequelize errors
//     if (err.name === 'SequelizeUniqueConstraintError') {
//       throw new Error('Car model with this name already exists');
//     }
//     if (err.name === 'SequelizeForeignKeyConstraintError') {
//       throw new Error('Invalid makeId provided');
//     }

//     throw err;
//   }
// };

// const getModelById = async (id: number) => {
//   try {
//     if (!id || id <= 0) {
//       throw new Error('Valid id is required');
//     }

//     return await CarModel.findByPk(id);

//   } catch(err){
//     console.error('Failed to get model by id:', err);
//     throw err;
//   }
// };

// const getModelByName = async (name: string) => {
//   try {
//     if (!name?.trim()) {
//       throw new Error('Name is required');
//     }

//     return await CarModel.findOne({ where: { name: name.trim() } });

//   } catch(err){
//     console.error('Failed to get model by name:', err);
//     throw err;
//   }
// };

// const getModelsByMakeId = async (makeId: number) => {
//   try {
//     if (!makeId || makeId <= 0) {
//       throw new Error('Valid makeId is required');
//     }

//     return await CarModel.findAll({
//       where: { makeId },
//       order: [['name', 'ASC']]
//     });

//   } catch(err){
//     console.error('Failed to get models by makeId:', err);
//     throw err;
//   }
// };

// export default {
//   createModel,
//   getModelById,
//   getModelByName,
//   getModelsByMakeId,
// };

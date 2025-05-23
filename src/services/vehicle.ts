import { Vehicle } from '../models/vehiclesModel';
import { Op } from 'sequelize';
import { CarModel } from '../models/carModelsModel';
import { Make } from '../models/carMakesModel';
import { SearchVehiclesParams } from '../types/vehicle';

const createVehicle = async (vehicle: Vehicle) => {};

const getVehicleById = async (id: number) => {};

const getVehicles = async ({ search, makeId, modelIds, sold, limit, offset }: SearchVehiclesParams) => {
  const where: any = {};
  let include: any[] = [
    {
      model: CarModel,
      as: 'model',
      include: [
        {
          model: Make,
          as: 'make',
        },
      ],
    },
  ];

  if (search) {
    where[Op.or] = [
      { vin: { [Op.iLike]: `%${search}%` } },
      { '$model.name$': { [Op.iLike]: `%${search}%` } },
      { '$model.make.name$': { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (modelIds && modelIds.length > 0) {
    where.modelId = { [Op.in]: modelIds };
  }
  if (typeof sold === 'boolean') {
    where.sold = sold;
  }
  if (makeId) {
    include[0].where = { makeId };
    include[0].required = true;
  }

  return await Vehicle.findAndCountAll({
    where,
    include,
    limit,
    offset,
  });
};

const deleteVehicleById = async (id: number) => {};

const updateVehicleById = async (vehicle: Vehicle, id: number) => {};

const getVehicleByVin = async (vin: string) => {};

const getAllMakes = async () => {
  return await Make.findAll();
};

const getModelsByMakeId = async (makeId: number) => {
  return await CarModel.findAll({ where: { makeId } });
};

export default {
  createVehicle,
  getVehicles,
  getVehicleById,
  deleteVehicleById,
  updateVehicleById,
  getAllMakes,
  getModelsByMakeId,
};

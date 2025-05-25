import { Vehicle } from '../models/vehiclesModel';
import { Op } from 'sequelize';
import { CarModel } from '../models/carModelsModel';
import { Make } from '../models/carMakesModel';
import { SearchVehiclesParams } from '../types/vehicle';
import { User } from '../models/usersModel';

interface CreateVehicleData {
  modelId: number;
  year: number;
  vin: string;
  location: {
    country: string;
    city: string;
    street: string;
    zipcode: string;
    state: string;
    lat?: number;
    lng?: number;
  };
  userId?: number;
}

const createVehicle = async (vehicleData: CreateVehicleData) => {
  try {
    const savedVehicle = await Vehicle.create({
      modelId: vehicleData.modelId,
      year: vehicleData.year,
      vin: vehicleData.vin,
      location: vehicleData.location,
      sold: false,
    });
    return savedVehicle.dataValues;
  } catch (error) {
    throw new Error('Failed to create vehicle');
  }
};

const getVehicles = async ({ search, makeId, modelIds, sold, limit, offset, userId }: SearchVehiclesParams) => {
  if (!userId) throw new Error('UserId is required');
  const user = await User.findByPk(parseInt(userId));
  if (!user) throw new Error('User not found');

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

  const favVehicles = await user.getFavorite({
    joinTableAttributes: [],
    include: [
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
    ],
  });
  const favoriteVehicleIds = favVehicles.map(vehicle => vehicle.id);

  const vehicleData = await Vehicle.findAndCountAll({
    where,
    include,
    limit,
    offset,
  });

  return {
    ...vehicleData,
    favVehicles,
    favoriteVehicleIds,
  };
};

const getVehicleByVin = async (vin: string) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { vin },
    });
    return vehicle?.dataValues || null;
  } catch (error) {
    throw new Error('Failed to fetch vehicle');
  }
};

const getVehicleById = async (id: number) => {
  try {
    const vehicle = await Vehicle.findByPk(id);

    return vehicle?.dataValues || null;
  } catch (error) {
    throw new Error('Failed to fetch vehicle');
  }
};

export default {
  createVehicle,
  getVehicleByVin,
  getVehicles,
  getVehicleById,
};

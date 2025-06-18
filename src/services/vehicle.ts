import { CreateOptions, DestroyOptions, Op, UpdateOptions } from 'sequelize';
import { Make } from '../models/carMakesModel';
import { Vehicle } from '../models/vehiclesModel';
import { CarModel } from '../models/carModelsModel';
import { Customer } from '../models/customersModel';
import { SearchVehiclesParams } from '../types/vehicle';
import { customerService, vehicleService } from '.';
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
  createdAt?: Date;
}

const createVehicle = async (vehicleData: CreateVehicleData, userId?: number) => {
  try {
    const savedVehicle = await Vehicle.create(
      {
        modelId: vehicleData.modelId,
        year: vehicleData.year,
        vin: vehicleData.vin,
        location: vehicleData.location,
      },
      { userId } as CreateOptions,
    );
    return savedVehicle.dataValues;
  } catch (err: any) {
    console.log('Failed to create vehicle', err);
    throw err;
  }
};

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
    if (sold) {
      where.customerId = { [Op.not]: null };
    } else {
      where.customerId = null;
    }
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
    order: [
      ['createdAt', 'DESC'],
      ['id', 'DESC'],
    ],
  });
};

const getVehicleByVin = async (vin: string) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { vin },
    });
    return vehicle?.dataValues || null;
  } catch (err) {
    console.error('Failed to fetch vehicle', err);
    throw err;
  }
};

const getVehicleById = async (id: number, userId?: number) => {
  try {
    const vehicle = await Vehicle.findByPk(id, {
      include: [
        {
          model: CarModel,
          as: 'model',
          include: [{ model: Make, as: 'make' }],
        },
        {
          model: User,
          as: 'favorite',
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });

    if (!vehicle) return null;

    return vehicle.dataValues;
  } catch (err) {
    console.error('Failed to fetch vehicle', err);
    throw err;
  }
};

const updateVehicleByCustomerId = async (customerId: number, vehicleId: number, userId?: number) => {
  try {
    if (!customerId || !vehicleId) {
      throw new Error('Customer ID or vehicle ID missing');
    }

    const customer = await customerService.findCustomerById(customerId);
    if (!customer) {
      throw new Error('Customer data missing');
    }

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle data missing');
    }

    const [updatedCount] = await Vehicle.update({ customerId, assignedDate: new Date() }, {
      where: { id: vehicleId },
      individualHooks: true,
      userId: userId,
    } as UpdateOptions);

    if (updatedCount === 0) {
      throw new Error('Vehicle update failed - no rows affected');
    }

    return updatedCount;
  } catch (err: any) {
    console.error('Error in updateVehicleByCustomerId:', err);
    throw err;
  }
};

const getAllVehicleLocationsAndCounts = async () => {
  const vehicles = await Vehicle.findAll({
    attributes: ['id', 'year', 'vin', 'location', 'customerId', 'assignedDate'],
    include: [
      {
        model: CarModel,
        as: 'model',
        include: [{ model: Make, as: 'make' }],
      },
      {
        model: Customer,
        as: 'customer',
      },
    ],
  });
  const vehicleLocations = vehicles.map((v: any) => ({
    id: v.id,
    year: v.year,
    vin: v.vin,
    lat: v.location.lat ? v.location.lat : null,
    lng: v.location.lng ? v.location.lng : null,
    model: v.model
      ? {
          id: v.model.id,
          name: v.model.name,
        }
      : null,
    make:
      v.model && v.model.make
        ? {
            id: v.model.make.id,
            name: v.model.make.name,
          }
        : null,
    customer: v.customer,
    assignedDate: v.assignedDate,
  }));
  const totalCount = vehicles.length;
  const totalSoldVehicles = vehicles.filter((v: any) => v.customerId).length;
  const totalCustomerCount = await Customer.count();
  return { vehicleLocations, totalCount, totalSoldVehicles, totalCustomerCount };
};

const deleteVehicle = async (id: number, userId?: number) => {
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (vehicle) {
      return await vehicle.destroy({ userId } as DestroyOptions);
    }
  } catch (err) {
    console.error('Fail to delete vehicle', err);
    throw err;
  }
};

const updateVehicle = async (id: number, vehicleData: CreateVehicleData, userId?: number) => {
  try {
    const [updatedCount] = await Vehicle.update({ ...vehicleData, assignedDate: new Date() }, {
      where: { id: id },
      individualHooks: true,
      userId,
    } as UpdateOptions);
    if (updatedCount === 0) {
      throw new Error('Vehicle update failed - no rows affected');
    }

    return updatedCount;
  } catch (err) {
    console.error('Failed to update vehicle', err);
    throw err;
  }
};

const unassignVehicle = async (userId?: number, vehicleId?: number, customerId?: number) => {
  try {
    if (customerId && !vehicleId) {
      const [updatedCount] = await Vehicle.update({ customerId: null, assignedDate: null }, {
        where: { customerId },
        individualHooks: true,
        userId,
      } as UpdateOptions);
      if (updatedCount === 0) {
        throw new Error('No vehicles were unassigned');
      }
      return updatedCount;
    }

    if (!vehicleId) {
      throw new Error('Vehicle ID is required when unassigning a single vehicle');
    }

    const [updatedCount] = await Vehicle.update({ customerId: null, assignedDate: null }, {
      where: { id: vehicleId },
      individualHooks: true,
      userId: userId,
    } as UpdateOptions);

    if (updatedCount === 0) {
      throw new Error('Vehicle update failed - no rows affected');
    }

    return updatedCount;
  } catch (err) {
    console.error('Failed to unassign vehicle', err);
    throw err;
  }
};

const getVehiclesByCustomerId = async (customerId: number) => {
  const vehicles = await Vehicle.findAll({
    where: { customerId },
  });
  return vehicles;
};

export default {
  createVehicle,
  getVehicleByVin,
  getVehicles,
  getVehicleById,
  updateVehicleByCustomerId,
  getAllVehicleLocationsAndCounts,
  deleteVehicle,
  updateVehicle,
  unassignVehicle,
  getVehiclesByCustomerId,
};

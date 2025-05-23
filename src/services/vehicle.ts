import { Vehicle } from '../models/vehiclesModel';

interface CreateVehicleData {
  modelId: number;
  year: number;
  vin: string;
  location: {
    country: string;
    city: string;
    street: string;
    zipCode: string;
    state: string;
    lat?:number;
    lng?:number;
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

const getVehicleByVin = async (vin: string) => {
  try {
   
    const vehicle = await Vehicle.findOne({
      where: { vin }
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
  getVehicleById,
};

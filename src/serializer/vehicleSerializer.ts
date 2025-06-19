import { VehicleAttributes } from '../models/vehiclesModel';
import { LocationData } from '../schemas/vehiclesSchema';
import { customerService, favoritesService, makeService, modelService, vehicleService } from '../services';

interface Make {
  id: number;
  name: string;
}

interface Model {
  id: number;
  name: string;
  make?: Make;
}

interface RawVehicle {
  id: number;
  year: number;
  vin: string;
  location: string;
  customerId: number | null;
  userId: number;
  createdAt: string;
  model?: Model | null;
}

interface SerializedVehicle {
  id: number;
  year: number;
  vin: string;
  location: string;
  customerId: number | null;
  userId: number;
  createdAt: string;
  favorite: boolean;
  model: {
    id: number;
    name: string;
  } | null;
  make: {
    id: number;
    name: string;
  } | null;
}

interface SerializedVehicleForActivity {
  id: number;
  year: number;
  vin: string;
  location: LocationData;
  customer: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  } | null;
  model: {
    id: number;
    name: string;
  } | null;
  make: {
    id: number;
    name: string;
  } | null;
}

const getUserFavoriteIds = async (userId?: string | number): Promise<Set<number>> => {
  if (!userId) {
    return new Set();
  }

  try {
    const favorites = await favoritesService.getFavoritesByUserId(Number(userId));
    return new Set(favorites.map((fav: any) => fav.id));
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return new Set();
  }
};

const serializeVehicle = (vehicle: RawVehicle, favoriteVehicleIds: Set<number>): SerializedVehicle => {
  return {
    id: vehicle.id,
    year: vehicle.year,
    vin: vehicle.vin,
    location: vehicle.location,
    customerId: vehicle.customerId,
    userId: vehicle.userId,
    createdAt: vehicle.createdAt,
    favorite: favoriteVehicleIds.has(vehicle.id),
    model: vehicle.model
      ? {
          id: vehicle.model.id,
          name: vehicle.model.name,
        }
      : null,
    make:
      vehicle.model && vehicle.model.make
        ? {
            id: vehicle.model.make.id,
            name: vehicle.model.make.name,
          }
        : null,
  };
};

const serializeSingleVehicle = async (vehicle: RawVehicle, userId?: number) => {
  const favoriteVehicleIds = await getUserFavoriteIds(userId);
  return serializeVehicle(vehicle, favoriteVehicleIds);
};

export const serializeVehicleFromService = async (
  vehicleId: number,
  vehicleService: any,
  userId?: number,
): Promise<SerializedVehicle | null> => {
  try {
    const vehicle: RawVehicle = await vehicleService.getVehicleById(vehicleId);

    if (!vehicle) {
      return null;
    }

    return await serializeSingleVehicle(vehicle, userId as number);
  } catch (error) {
    console.error('Error serializing vehicle from service:', error);
    throw error;
  }
};

export const serializeVehicleForUserActivity = async (
  vehicle: VehicleAttributes,
): Promise<SerializedVehicleForActivity | null> => {
  try {
    if (!vehicle?.id) return null;

    const model = await modelService.getModelById(vehicle.modelId);
    let make = null;
    let customer = null;

    if (model?.makeId) {
      make = await makeService.getMakeById(model.makeId);
    }

    if (vehicle.customerId) {
      customer = await customerService.getCustomerById(vehicle.customerId);
    }

    const formattedVehicle = {
      ...vehicle,
      make: make || null,
      model: model ? { id: model.id, name: model.name } : null,
      customer: customer,
    };

    return formattedVehicle;
  } catch (error) {
    console.error('Error serializing vehicle:', error);
    throw error;
  }
};

export type { SerializedVehicle, RawVehicle };


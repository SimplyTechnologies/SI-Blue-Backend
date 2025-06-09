import { favoritesService } from "../services";


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

const serializeSingleVehicle = async (
  vehicle: RawVehicle, 
  userId?: number
) => {
  const favoriteVehicleIds = await getUserFavoriteIds(userId);
 
  return serializeVehicle(vehicle, favoriteVehicleIds);
};



export const serializeVehicleFromService = async (
  vehicleId: number,
  vehicleService: any, 
  userId?: number
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





export type { SerializedVehicle, RawVehicle };
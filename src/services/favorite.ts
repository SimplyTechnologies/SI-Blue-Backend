import { Make } from '../models/carMakesModel';
import { CarModel } from '../models/carModelsModel';
import { User } from '../models/usersModel';
import { Vehicle } from '../models/vehiclesModel';

const createFavorite = async (userId: number, vehicleId: number) => {
  try {
    if (!userId || !vehicleId) {
      throw new Error('UserId and vehicleId are required');
    }
    const user = await User.findByPk(userId);
    const vehicle = await Vehicle.findByPk(vehicleId);

    if (!user || !vehicle) throw new Error('User or vehicle not found');

    await user.addFavorite(vehicle);
    return { userId, vehicleId };
  } catch (err) {
    console.error('Failed to create favorite', err);
    throw err;
  }
};

const getFavoritesByUserId = async (userId: number) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    return await user.getFavorite({
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
  } catch (err) {
    console.error('Failed to get favorite by user id');
    throw err;
  }
};

const deleteFavoriteById = async (userId: number, vehicleId: number) => {
  try {
    if (!userId || !vehicleId) {
      throw new Error('UserId and vehicleId are required');
    }
    const user = await User.findByPk(userId);
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!user || !vehicle) throw new Error('User or vehicle not found');

    await user.removeFavorite(vehicle);
  } catch (err) {
    console.error('Failed to delete favorite by userId');
    throw err;
  }
};

export default {
  createFavorite,
  getFavoritesByUserId,
  deleteFavoriteById,
};


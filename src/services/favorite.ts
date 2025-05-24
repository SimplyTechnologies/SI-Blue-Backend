import { User } from '../models/usersModel';
import { Vehicle } from '../models/vehiclesModel';

const createFavorite = async (userId: number, vehicleId: number) => {
  const user = await User.findByPk(userId);
  const vehicle = await Vehicle.findByPk(vehicleId);

  if (!user || !vehicle) throw new Error('User or vehicle not found');

  await user.addFavorite(vehicle);
  return { userId, vehicleId };
};

const getFavoritesByUserId = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  return await user.getFavorites();
};

const deleteFavoriteById = async (userId: number, vehicleId: number) => {
  const user = await User.findByPk(userId);
  const vehicle = await Vehicle.findByPk(vehicleId);
  if (!user || !vehicle) throw new Error('User or vehicle not found');

  await user.removeFavorite(vehicle);
};

export default {
  createFavorite,
  getFavoritesByUserId,
  deleteFavoriteById,
};


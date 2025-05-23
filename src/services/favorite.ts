import { Favorite } from '../models/favorites';

const createFavorite = async (userId: number, vehicleId: number) => {
  return await Favorite.create({ userId, vehicleId });
};

const getFavoritesByUserId = async (userId: number) => {
  return await Favorite.findAll({ where: { userId } });
};

const deleteFavoriteById = async (userId: number) => {
    return await Favorite.destroy({ where: { userId } });
};

export default { createFavorite, getFavoritesByUserId, deleteFavoriteById };

import { Request, Response } from 'express';
import { User } from '../models/usersModel';
import { Vehicle } from '../models/vehiclesModel';
import { favoritesService } from '../services';

export const createFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const vehicleId = req.body.vehicleId;

    if (!userId || !vehicleId) {
      return res.status(400).json({ message: 'userId and vehicleId are required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const favorite = await favoritesService.createFavorite(userId, vehicleId);

    return res.status(201).json({
      favorite,
    });
  } catch (error) {
    console.error('Error creating favorite:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFavoritesByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const favorites = await favoritesService.getFavoritesByUserId(userId);

    return res.status(200).json({
      favorites,
    });
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteFavoriteById = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    await favoritesService.deleteFavoriteById(userId);

    return res.status(200).json({
      message: 'Favorite deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
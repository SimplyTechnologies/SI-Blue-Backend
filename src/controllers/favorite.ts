import { Request, Response } from 'express';
import { favoritesService } from '../services';
import { userService } from '../services';
import { vehicleService } from '../services';

export const createFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const vehicleId = req.body.vehicleId;

    if (!userId || !vehicleId) {
      return res.status(400).json({ message: 'userId and vehicleId are required' });
    }

    const vehicle = await vehicleService.getVehicleById(vehicleId);
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
    const userId = parseInt(req.params.userId);
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const favorites = await favoritesService.getFavoritesByUserId(userId);

    const result = favorites.map((v: any) => ({
      id: v.id,
      year: v.year,
      vin: v.vin,
      location: v.location,
      customerId: v.customerId,
      userId: v.userId,
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
    }));

    return res.status(200).json({
      result,
    });
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteFavoriteById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { vehicleId } = req.params;

    if (!userId || !vehicleId) {
      return res.status(400).json({ message: 'userId and vehicleId are required' });
    }

    await favoritesService.deleteFavoriteById(userId, Number(vehicleId));

    return res.status(200).json({
      message: 'Favorite deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

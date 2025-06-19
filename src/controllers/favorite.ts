import { Request, Response } from 'express';
import { favoritesService } from '../services';
import { userService } from '../services';
import { vehicleService } from '../services';
import { ResponseHandler } from '../handlers/errorHandler';

export const createFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const vehicleId = req.body.vehicleId;

    if (!userId || !vehicleId) {
      return ResponseHandler.badRequest(res, 'UserId and vehicleId are required');
    }

    const vehicle = await vehicleService.getVehicleById(vehicleId);
    if (!vehicle) {
      return ResponseHandler.notFound(res, 'Vehicle not found');
    }

    const favorite = await favoritesService.createFavorite(userId, vehicleId);
    ResponseHandler.created(res, 'Favorite created successfully', favorite);
  } catch (error) {
    console.error('Error creating favorite:', error);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

export const getFavoritesByUserId = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId) {
      return ResponseHandler.badRequest(res, 'UserId is required');
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
    ResponseHandler.success(res, 'Retrieve favorite successfully', result);
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

export const deleteFavoriteById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { vehicleId } = req.params;

    if (!userId || !vehicleId) {
      return ResponseHandler.badRequest(res, 'UserId and vehicleId are required');
    }

    await favoritesService.deleteFavoriteById(userId, Number(vehicleId));

    ResponseHandler.success(res, 'Favorite removed successfully');
  } catch (error) {
    console.error('Error deleting favorite:', error);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};


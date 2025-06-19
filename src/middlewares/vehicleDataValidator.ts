import { NextFunction, Request, Response } from 'express';
import vehicleService from '../services/vehicle.js';
import { ResponseHandler } from '../handlers/errorHandler.js';

declare global {
  namespace Express {
    interface Request {
      vehicle?: {
        modelId: number;
        year: number;
        vin: string;
        createdAt?: Date;
        location: {
          country: string;
          city: string;
          street: string;
          zipcode: string;
          state: string;
          lat?: number;
          lng?: number;
        };
      };
    }
  }
}

const validateInput = (body: any) => {
  const { vin, location } = body;

  if (!vin) {
    return { isValid: false, message: 'VIN is required' };
  }

  if (!location) {
    return { isValid: false, message: 'Location is required' };
  }

  const { country, street, zipcode, state } = location;
  if (!country || !street || !zipcode || !state) {
    return {
      isValid: false,
      message: 'Complete location required (country, street, zipcode, state)',
    };
  }

  return { isValid: true };
};

export const validateInputVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { modelId, year, vin, location } = req.body;

    const existedCar = await vehicleService.getVehicleByVin(vin);

    if (existedCar) {
      return ResponseHandler.badRequest(res, 'Vehicle already exists');
    }

    const validation = validateInput(req.body);
    if (!validation.isValid) {
      return ResponseHandler.badRequest(res, 'Validation failed', validation.message);
    }

    req.vehicle = {
      modelId,
      year,
      vin,
      location,
    };

    next();
  } catch (error: any) {
    console.error('Vehicle validation middleware error:', error);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

export const validateInputVehicleUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { modelId, year, vin, location } = req.body;

    const { id } = req.params;

    const vehicle = await vehicleService.getVehicleById(parseInt(id));

    if (!vehicle) {
      return ResponseHandler.notFound(res, 'Vehicle not found');
    }

    const validation = validateInput(req.body);
    if (!validation.isValid) {
      return ResponseHandler.badRequest(res, 'Validation failed', validation.message);
    }

    req.vehicle = {
      ...vehicle,
      modelId,
      year,
      vin,
      location,
    };

    next();
  } catch (error: any) {
    console.error('Vehicle validation middleware error:', error);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};


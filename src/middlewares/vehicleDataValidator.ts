import { NextFunction, Request, Response } from 'express';
import vehicleService from '../services/vehicle.js';

declare global {
  namespace Express {
    interface Request {
      vehicle?: {
        modelId: number;
        year: number;
        vin: string;
        createdAt?:Date;
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
      return res.status(400).json({ message: 'Vehicle already exists' });
    }

    const validation = validateInput(req.body);
    if (!validation.isValid) {
      res.status(400).json({ message: validation.message });
      return;
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
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

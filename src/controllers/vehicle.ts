import { Request, Response } from 'express';
import vehicleService from '../services/vehicle.js';
declare global {
  namespace Express {
    interface Request {
      vehicle?: {
        modelId: number;
        year: number;
        vin: string;
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

const createVehicle = async (req: Request, res: Response) => {
  try {
    if (!req.vehicle) {
      res.status(400).json({
        success: false,
        message: 'Vehicle data is missing.',
      });
      return;
    }

    await vehicleService.createVehicle(req.vehicle);

    res.status(201).json({
      message: 'Vehicle created successfully',
    });
  } catch (error: unknown) {
    console.error('Error creating vehicle:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create vehicle',
    });
  }
};

const getVehicleByVin = async (req: Request, res: Response) => {};

export default {
  createVehicle,
  getVehicleByVin,
};


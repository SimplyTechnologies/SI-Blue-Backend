import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import vehicleService from '../services/vehicle.js';
import { makeService, modelService } from '../services/index.js';

import config from '../configs/config';

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

const validateInput = (body: any) => {
  const { vin, location } = body;

  if (!vin) {
    return { isValid: false, message: 'VIN is required' };
  }

  if (!location) {
    return { isValid: false, message: 'Location is required' };
  }

  const { country, street, zipcode, state, lat, lng } = location;
  if (!country || !street || !zipcode || !state) {
    return {
      isValid: false,
      message: 'Complete location required (country, street, zipcode, state)',
    };
  }

  return { isValid: true };
};

const resolveMakeAndModel = async (vehicleInfo: any) => {
  const [existingMake, existingModel] = await Promise.all([
    makeService.getMakeByName(vehicleInfo.make),
    modelService.getModelByName(vehicleInfo.model),
  ]);

  let makeId: number;
  let modelId: number;

  if (existingMake) {
    makeId = existingMake.id;
  } else {
    const newMake = await makeService.createMake(vehicleInfo.make);
    makeId = newMake.id;
  }

  if (existingModel) {
    modelId = existingModel.id;
  } else {
    const newModel = await modelService.createModel({
      name: vehicleInfo.model,
      makeId: makeId,
    });
    modelId = newModel.id;
  }

  return { modelId };
};
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.substring(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required, please login' });
    }

    const decode = (await jwt.verify(token, config.jwt.secret as any)) as any;

    if (!decode) {
      return res.status(402).json({ message: 'Invalid token' });
    }

    req.user = decode.id;
    req.userId = decode.id;
    next();
  } catch (err) {
    if (err instanceof Error && err.message === 'jwt expired') {
      return res.status(401).json({ message: 'Token expired!' });
    }
    return res.status(500).json({ err: err instanceof Error ? err.message : err });
  }
};

export const validateInputVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { modelId, makeId, year, vin, location } = req.body;

    const existedCar = await vehicleService.getVehicleByVin(vin);

    if (existedCar) {
      return res.status(400).json({ message: 'Vehicle already exists' });
    }

    const validation = validateInput(req.body);
    if (!validation.isValid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    // const vehicleInfo = await getVehicleInfo(vin);
    // if (!vehicleInfo || !vehicleInfo.make || !vehicleInfo.model) {
    //   res.status(404).json({ message: 'Vehicle information not found for this VIN' });
    //   return;
    // }

    // const { modelId } = await resolveMakeAndModel(vehicleInfo);

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

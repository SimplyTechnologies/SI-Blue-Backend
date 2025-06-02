import { NextFunction, Request, Response } from 'express';

import vehicleService from '../services/vehicle.js';
import { makeService, modelService } from '../services/index.js';

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

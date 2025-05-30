import { Request, Response } from 'express';
import { getVehicleInfo } from '../services/vinService';

export const decodeVin = async (req: Request, res: Response) => {
  try {
    const { vin } = req.body;
    if (!vin) {
      return res.status(400).json({
        error: 'VIN is required',
      });
    }

    if (vin.length !== 17) {
      return res.status(400).json({
        error: 'VIN must be 17 characters long',
      });
    }

    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
    if (!vinRegex.test(vin)) {
      return res.status(400).json({
        error: 'Invalid VIN format',
      });
    }

    const vehicleInfo = await getVehicleInfo(vin.toUpperCase());

    if (!vehicleInfo?.vehicleMake) {
      return res.status(400).json({
        error: 'Vehicle make not found in database',
      });
    }

    if (!vehicleInfo.vehicleModel) {
      return res.status(400).json({
        error: 'Vehicle model not found in database',
      });
    }
    const { makeId, ...modelWithoutMakeId } = vehicleInfo.vehicleModel;

    return res.status(200).json({
      data: {
        vehicleMake: vehicleInfo.vehicleMake,
        vehicleModel: modelWithoutMakeId,
        year: vehicleInfo.year,
      },
    });
  } catch (error: any) {
    console.error('Error decoding VIN:', error);

    return res.status(400).json({
      message: error.message || 'Failed to decode VIN',
    });
  }
};

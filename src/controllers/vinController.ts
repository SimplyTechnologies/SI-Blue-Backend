import { Request, Response } from 'express';
import { getVehicleInfo } from '../services/vinService';
import { ResponseHandler } from '../handlers/errorHandler';

export const decodeVin = async (req: Request, res: Response) => {
  try {
    const { vin } = req.body;
    if (!vin) {
      return ResponseHandler.badRequest(res, 'VIN is required')
      
    }

    if (vin.length !== 17) {
      return ResponseHandler.badRequest(res, 'VIN must be 17 characters long')
      
    }

    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
    if (!vinRegex.test(vin)) {
      return ResponseHandler.badRequest(res, 'Invalid VIN format')
    }

    const vehicleInfo = await getVehicleInfo(vin.toUpperCase());

    if (!vehicleInfo?.vehicleMake) {
      return ResponseHandler.badRequest(res, 'Vehicle make not found in database')
    }

    if (!vehicleInfo.vehicleModel) {
      return ResponseHandler.badRequest(res, 'Vehicle model not found in database')
    }
    const { makeId, ...modelWithoutMakeId } = vehicleInfo.vehicleModel;
    const  data = {
      vehicleMake: vehicleInfo.vehicleMake,
      vehicleModel: modelWithoutMakeId,
      year: vehicleInfo.year,
    }
    ResponseHandler.success(res, 'Vehicle info fetched successfully', data);
     
    
  } catch (error: any) {
    console.error('Error decoding VIN:', error);
    return ResponseHandler.badRequest(res, 'Failed to decode VIN')
  }
};

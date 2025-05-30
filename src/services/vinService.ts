import axios from 'axios';
import makeService from './makeService';
import modelService from './modelService';

interface VehicleResult {
  Variable: string;
  Value: string | null;
}

interface NHTSAResponse {
  Results: VehicleResult[];
}

interface VehicleInfo {
  make: string | null;
  model: string | null;
  year: string | null;
}

const BASE_URL = process.env.BASE_URL as string;

export const getVehicleInfo = async (vin: string) => {
  try {
    const response = await axios.get<NHTSAResponse>(`${BASE_URL}/vehicles/DecodeVin/${vin}?format=json`);

    const results = response.data?.Results;

    if (!results || !Array.isArray(results)) {
      throw new Error('Invalid response from NHTSA API');
    }

    const errorCode = results.find(item => item.Variable === 'Error Code');
    if (errorCode && errorCode.Value !== '0') {
      throw new Error('Invalid VIN provided');
    }

    const make = results.find(item => item.Variable === 'Make')?.Value || null;
    const model = results.find(item => item.Variable === 'Model')?.Value || null;
    const year = results.find(item => item.Variable === 'Model Year')?.Value || null;

    const dbMake = await makeService.getMakeByName(make as string);
    const dbModel = await modelService.getModelByName(model as string);
    if (!dbMake && !dbMake) {
      const createdMake = await makeService.createMake(make as string);
      const createdModel = await modelService.createModel({ name: model as string, makeId: createdMake.id });

      return { vehicleMake: createdMake, vehicleModel: createdModel, year };
    }
    if (dbMake && !dbModel) {
      const makeId = dbMake.dataValues.id;
      const createdModel = await modelService.createModel({ name: model as string, makeId });
      return { vehicleMake: dbMake, vehicleModel: createdModel, year };
    }
    if (dbModel && dbMake) {
      return { vehicleMake: dbMake.dataValues, vehicleModel: dbModel, year };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - NHTSA API is not responding');
      }
      throw new Error(error.message || 'Failed to decode VIN');
    }

    if (error instanceof Error) {
      if (error.message === 'Invalid VIN provided') {
        throw new Error(
          'Vehicle information isn’t available for this VIN. Please enter the make, model, and year manually',
        );
      }
      throw new Error(error.message || 'Failed to decode VIN');
    }

    throw new Error('An unknown error occurred while decoding VIN');
  }
};

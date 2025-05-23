import axios from 'axios';

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

    return { make, model, year };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - NHTSA API is not responding');
      }
      throw new Error(error.message || 'Failed to decode VIN');
    }

    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to decode VIN');
    }

    throw new Error('An unknown error occurred while decoding VIN');
  }
};

import { Request, Response } from 'express';
import { format } from 'fast-csv';
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

const PAGE_SIZE = 25;

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

const getVehicles = async (req: Request, res: Response) => {
  try {
    const { search, makeId, modelIds, availability, page, offset } = req.query;
    let modelIdsArray: number[] | undefined = undefined;
    let sold: boolean | undefined = undefined;
    const pageNum = page ? Math.max(Number(page), 1) : 1;
    const limit = offset ? Number(offset) : PAGE_SIZE;
    const offsetNum = (pageNum - 1) * limit;

    if (modelIds) {
      if (Array.isArray(modelIds)) {
        modelIdsArray = modelIds.map(Number);
      } else if (typeof modelIds === 'string') {
        modelIdsArray = modelIds.split(',').map(Number);
      }
    }
    if (availability === 'Sold') sold = true;
    else if (availability === 'In Stock') sold = false;

    const { rows, count } = await vehicleService.getVehicles({
      search: search as string,
      makeId: makeId ? Number(makeId) : undefined,
      modelIds: modelIdsArray,
      sold,
      limit,
      offset: offsetNum,
    });

    const result = rows.map((v: any) => ({
      id: v.id,
      year: v.year,
      vin: v.vin,
      location: v.location,
      sold: v.sold,
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
    res.json({
      vehicles: result,
      total: count,
      page: pageNum,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const exportVehiclesCsv = async (req: Request, res: Response) => {
  try {
    const { makeId, modelIds, availability } = req.query;
    let modelIdsArray: number[] | undefined = undefined;
    let sold: boolean | undefined = undefined;

    if (modelIds) {
      if (Array.isArray(modelIds)) {
        modelIdsArray = modelIds.map(Number);
      } else if (typeof modelIds === 'string') {
        modelIdsArray = modelIds.split(',').map(Number);
      }
    }
    if (availability === 'Sold') sold = true;
    else if (availability === 'In Stock') sold = false;

    const { rows } = await vehicleService.getVehicles({
      makeId: makeId ? Number(makeId) : undefined,
      modelIds: modelIdsArray,
      sold,
    });

    const csvRows = rows.map((v: any) => ({
      year: v.year,
      make: v.model && v.model.make ? v.model.make.name : '',
      model: v.model ? v.model.name : '',
      vin: v.vin,
      availability: v.sold ? 'Sold' : 'In Stock',
      location: v.location
        ? `${v.location.street}, ${v.location.city}, ${v.location.state} ${v.location.zipcode}, ${v.location.country}`
        : '',
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="vehicles.csv"');

    const csvStream = format({ headers: true });
    csvStream.pipe(res);
    csvRows.forEach(row => csvStream.write(row));
    csvStream.end();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  createVehicle,
  getVehicleByVin,
  getVehicles,
  exportVehiclesCsv,
};

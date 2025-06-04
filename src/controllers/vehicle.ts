import { Request, Response } from 'express';
import { format } from 'fast-csv';
import { vehicleService } from '../services';
import favoritesService from '../services/favorite';

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
      message: 'Failed to create vehicle',
    });
  }
};

const getVehicleByVin = async (req: Request, res: Response) => {};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(parseInt(id));

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({
      vehicle,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Failed to get vehicle by id',
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const { search, makeId, modelIds, availability, page, offset, favorite } = req.query;

    let modelIdsArray: number[] | undefined = undefined;
    let sold: boolean | undefined = undefined;
    const pageNum = page ? Math.max(Number(page), 1) : 1;
    const limit = offset ? Number(offset) : PAGE_SIZE;
    const offsetNum = (pageNum - 1) * limit;

    if (availability && !['Sold', 'In Stock'].includes(availability as string)) {
      res.json({
        vehicles: [],
        total: 0,
        page: pageNum,
        pageSize: limit,
        totalPages: 0,
      });
      return;
    }

    if (modelIds) {
      if (Array.isArray(modelIds)) {
        modelIdsArray = modelIds.map(Number);
      } else if (typeof modelIds === 'string') {
        modelIdsArray = modelIds.split(',').map(Number);
      }
    }
    if (availability === 'Sold') sold = true;
    else if (availability === 'In Stock') sold = false;

    let favoriteVehicleIds: Set<number> = new Set();
    let favorites: any[] = [];
    if (req.user) {
      try {
        favorites = await favoritesService.getFavoritesByUserId(Number(req.user));
        favoriteVehicleIds = new Set(favorites.map((fav: any) => fav.id));
      } catch {}
    }

    if (favorite === '1' && req.user) {
      const allVehicles = await vehicleService.getVehicles({
        search: search as string,
        makeId: makeId ? Number(makeId) : undefined,
        modelIds: modelIdsArray,
        sold,
      });

      const favoriteRows = allVehicles.rows.filter((v: any) => favoriteVehicleIds.has(v.id));
      const count = favoriteRows.length;

      const paginatedRows = favoriteRows.slice(offsetNum, offsetNum + limit);
      const result = paginatedRows.map((v: any) => ({
        id: v.id,
        year: v.year,
        vin: v.vin,
        location: v.location,
        sold: v.sold,
        userId: v.userId,
        createdAt: v.createdAt,
        favorite: true,
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
        previousId: pageNum === 1 ? null : pageNum - 1,
        nextId: Math.ceil(count / limit) > pageNum ? pageNum + 1 : null,
      });
      return;
    }

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
      createdAt: v.createdAt,
      favorite: favoriteVehicleIds.has(v.id),
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
      previousId: pageNum === 1 ? null : pageNum - 1,
      nextId: Math.ceil(count / limit) > pageNum ? pageNum + 1 : null,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const exportVehiclesCsv = async (req: Request, res: Response) => {
  try {
    const { makeId, modelIds, availability, favorite } = req.query;
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

    let rows: any[] = [];
    if (favorite === '1' && req.user) {
      const favorites = await favoritesService.getFavoritesByUserId(Number(req.user));
      const favoriteVehicleIds = new Set(favorites.map((fav: any) => fav.id));

      const allVehicles = await vehicleService.getVehicles({
        makeId: makeId ? Number(makeId) : undefined,
        modelIds: modelIdsArray,
        sold,
      });
      rows = allVehicles.rows.filter((v: any) => favoriteVehicleIds.has(v.id));
    } else {
      const result = await vehicleService.getVehicles({
        makeId: makeId ? Number(makeId) : undefined,
        modelIds: modelIdsArray,
        sold,
      });
      rows = result.rows;
    }

    const csvRows = rows.map((v: any) => ({
      VIN: v.vin,
      Make: v.model && v.model.make ? v.model.make.name : '',
      Model: v.model ? v.model.name : '',
      Year: v.year,
      Location: v.location
        ? `${v.location.street}, ${v.location.city}, ${v.location.state} ${v.location.zipcode}, ${v.location.country}`
        : '',
      Availability: v.sold ? 'Sold' : 'In Stock',
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

const getAllVehicleLocations = async (req: Request, res: Response) => {
  try {
    const { vehicleLocations, totalCount, totalSoldVehicles, totalCustomerCount } =
      await vehicleService.getAllVehicleLocationsAndCounts();
    res.json({
      vehicles: vehicleLocations,
      totalCount,
      totalSoldVehicles,
      totalCustomerCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vehicle locations' });
  }
};

export default {
  createVehicle,
  getVehicleByVin,
  getVehicles,
  getVehicleById,
  exportVehiclesCsv,
  getAllVehicleLocations,
};

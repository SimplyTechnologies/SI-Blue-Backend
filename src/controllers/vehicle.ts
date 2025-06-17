import { Request, Response } from 'express';
import { format } from 'fast-csv';
import { customerService, vehicleService } from '../services';
import favoritesService from '../services/favorite';
import { SerializedVehicle, serializeVehicleFromService } from '../serializer/vehicleSerializer';
import { ResponseHandler } from '../handlers/errorHandler';
import { sendEmail } from '../helpers/sendEmail';
import { join } from 'path';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import config from '../configs/config';
import { loadEmailTemplate } from '../services/emailTemplate';

declare global {
  namespace Express {
    interface Request {
      vehicle?: {
        modelId: number;
        year: number;
        vin: string;
        createdAt?: Date;
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
      return ResponseHandler.badRequest(res, 'Vehicle data');
    }

    await vehicleService.createVehicle(req.vehicle);

    ResponseHandler.created(res, 'Vehicle created successfully');
  } catch (error: unknown) {
    console.error('Error creating vehicle:', error);

    ResponseHandler.serverError(res, 'Failed to create vehicle');
  }
};

const getVehicleByVin = async (req: Request, res: Response) => {};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.id;
    if (!vehicleId) {
      return ResponseHandler.badRequest(res, 'Vehicle Id missing');
    }

    const vehicle: SerializedVehicle | null = await serializeVehicleFromService(
      Number(vehicleId),
      vehicleService,
      req.user?.id,
    );

    if (!vehicle) {
      return ResponseHandler.notFound(res, 'Vehicle not found');
    }

    ResponseHandler.success(res, 'Vehicle retrieved successfully', vehicle);
  } catch (error: unknown) {
    ResponseHandler.serverError(res, 'Internal server error');
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
      ResponseHandler.success(res, 'Availability not found', {
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
    if (req.user?.id) {
      try {
        favorites = await favoritesService.getFavoritesByUserId(Number(req.user.id));
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
        customerId: v.customerId,
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
      ResponseHandler.success(res, 'Vehicles retrieved successfully', {
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
      customerId: v.customerId,
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

    ResponseHandler.success(res, 'Vehicles retrieved successfully', {
      vehicles: result,
      previousId: pageNum === 1 ? null : pageNum - 1,
      nextId: Math.ceil(count / limit) > pageNum ? pageNum + 1 : null,
    });
  } catch (err) {
    ResponseHandler.serverError(res, 'Internal server error');
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
    if (favorite === '1' && req.user?.id) {
      const favorites = await favoritesService.getFavoritesByUserId(Number(req.user.id));
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
      Availability: !!v.customerId ? 'Sold' : 'In Stock',
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="vehicles.csv"');

    const csvStream = format({ headers: true });
    csvStream.pipe(res);
    csvRows.forEach(row => csvStream.write(row));
    csvStream.end();
  } catch (err) {
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

const getAllVehicleLocations = async (req: Request, res: Response) => {
  try {
    const { vehicleLocations, totalCount, totalSoldVehicles, totalCustomerCount } =
      await vehicleService.getAllVehicleLocationsAndCounts();
    ResponseHandler.success(res, 'Vehicle locations retrieved successfully', {
      vehicles: vehicleLocations,
      totalCount,
      totalSoldVehicles,
      totalCustomerCount,
    });
  } catch (error) {
    ResponseHandler.serverError(res, 'Failed to fetch vehicle locations');
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return ResponseHandler.badRequest(res, 'Id missing');
    }
    const vehicle = await vehicleService.getVehicleById(parseInt(id));
    if (!vehicle) {
      return ResponseHandler.notFound(res, 'Vehicle not found');
    }
    if (vehicle.customerId) {
      return ResponseHandler.badRequest(res, `Vehicle can't be deleted`);
    }

    await vehicleService.deleteVehicle(parseInt(id));
    ResponseHandler.success(res, 'Vehicle deleted successfully');
  } catch (error) {
    ResponseHandler.serverError(res, 'Failed to delete vehicle');
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    if (!req.vehicle) {
      return ResponseHandler.badRequest(res, 'Vehicle data is missing');
    }

    const vehicleId = parseInt(req.params.id);
    await vehicleService.updateVehicle(vehicleId, req.vehicle);

    const formattedVehicle: SerializedVehicle | null = await serializeVehicleFromService(
      vehicleId,
      vehicleService,
      req.user?.id as number,
    );

    ResponseHandler.success(res, 'Updated successfully', formattedVehicle as SerializedVehicle);
  } catch (error: unknown) {
    console.error('Error updating vehicle:', error);

    ResponseHandler.serverError(res, 'Failed to update vehicle');
  }
};

const unassignVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId, customerId, unassignAll } = req.body;
    if (!customerId) {
      return ResponseHandler.badRequest(res, 'Customer ID is required');
    }

    const customer = await customerService.findCustomerById(customerId);
    if (!customer) {
      return ResponseHandler.notFound(res, 'Customer not found');
    }

    const customerEmail = customer.email;

    if (unassignAll) {
      await vehicleService.unassignVehicle(undefined, customerId);
      const html = loadEmailTemplate('unassignAll.html', {
        FRONTEND_URL: config.frontendUrl,
        NAME: customer.firstName,
      });
      await sendEmail(customerEmail, 'Vehicles Unassignment Email', html);
      return ResponseHandler.success(res, 'All vehicles unassigned successfully');
    }

    if (!vehicleId) {
      return ResponseHandler.badRequest(res, 'Vehicle ID is required to unassign a single vehicle');
    }

    const vehicle = await vehicleService.getVehicleById(vehicleId);
    if (!vehicle) {
      return ResponseHandler.notFound(res, 'Vehicle not found');
    }

    await vehicleService.unassignVehicle(vehicleId);
    const html = loadEmailTemplate('unassignment.html', {
      FRONTEND_URL: config.frontendUrl,
      MAKE: vehicle.model?.make?.name,
      MODEL: vehicle.model?.name,
      VIN: vehicle.vin,
      YEAR: vehicle.year,
      NAME: customer.firstName,
    });
    await sendEmail(customerEmail, 'Vehicle Unassignment Email', html);
    return ResponseHandler.success(res, 'Vehicle unassigned successfully');
  } catch (error) {
    console.error('Error unassigning vehicle:', error);
    ResponseHandler.serverError(res, 'Failed to unassign vehicle');
  }
};

export default {
  createVehicle,
  getVehicleByVin,
  getVehicles,
  getVehicleById,
  exportVehiclesCsv,
  getAllVehicleLocations,
  deleteVehicle,
  updateVehicle,
  unassignVehicle,
};

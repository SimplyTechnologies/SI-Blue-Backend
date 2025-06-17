import { Request, Response } from 'express';
import { customerService, vehicleService } from '../services';
import { SerializedVehicle, serializeVehicleFromService } from '../serializer/vehicleSerializer';
import { ResponseHandler } from '../handlers/errorHandler';
import config from '../configs/config';
import { sendEmail } from '../helpers/sendEmail';
import { loadEmailTemplate } from '../services/emailTemplate';

const createCustomer = async (req: Request, res: Response) => {
  try {
    if (req.customerId) {
      const customerId = req.customerId;
      const vehicleId = req.vehicleId!;

      const customer = await customerService.findCustomerById(customerId);
      if (!customer) {
        return ResponseHandler.notFound(res, 'Customer not found');
      }

      const updatedCount: number = await vehicleService.updateVehicleByCustomerId(customerId, vehicleId);
      if (updatedCount === 0) {
        return ResponseHandler.serverError(res, 'Failed to update vehicle');
      }

      const formattedVehicle: SerializedVehicle | null = await serializeVehicleFromService(
        vehicleId,
        vehicleService,
        req.user?.id as number,
      );
      if (!formattedVehicle) {
        return ResponseHandler.notFound(res, 'Vehicle not found after update');
      }
      const html = loadEmailTemplate('assignment.html', {
        FRONTEND_URL: config.frontendUrl,
        YEAR: formattedVehicle.year,
        MAKE: formattedVehicle.make?.name,
        MODEL: formattedVehicle.model?.name,
        VIN: formattedVehicle.vin,
        NAME: customer.firstName,
      });
      const customerEmail = customer.email;
      await sendEmail(customerEmail, 'Vehicle Assignment Email', html);
      return ResponseHandler.success(res, 'Vehicle updated successfully for existing customer', {
        vehicle: formattedVehicle,
      });
    }

    const customer = req.customer;
    if (!customer) {
      return ResponseHandler.badRequest(res, 'Customer data missing');
    }

    const newCustomer = await customerService.createCustomer(customer);
    const vehicleId = req.body.vehicleId;
    if (!newCustomer?.id) {
      throw new Error('Customer Id missing');
    }

    await vehicleService.updateVehicleByCustomerId(newCustomer.id, vehicleId);

    const formattedVehicle: SerializedVehicle | null = await serializeVehicleFromService(
      vehicleId,
      vehicleService,
      req.user?.id as number,
    );

    if (!formattedVehicle) {
      return ResponseHandler.notFound(res, 'Vehicle not found after assignment');
    }
    const html = loadEmailTemplate('assignment.html', {
      FRONTEND_URL: config.frontendUrl,
      YEAR: formattedVehicle.year,
      MAKE: formattedVehicle.make?.name,
      MODEL: formattedVehicle.model?.name,
      VIN: formattedVehicle.vin,
      NAME: customer.firstName,
    });
    const customerEmail = newCustomer.email;
    await sendEmail(customerEmail, 'Vehicle Assignment Email', html);
    ResponseHandler.created(res, 'Customer created successfully', { vehicle: formattedVehicle });
  } catch (err) {
    console.error(err);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};
const getCustomer = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return ResponseHandler.badRequest(res, 'Email is required');
    }

    const customers = await customerService.searchDatabase(email as string);

    if (!customers) {
      return ResponseHandler.notFound(res, 'Customer not found');
    }

    ResponseHandler.success(res, 'Customers data retrieved successfully', { customers });
  } catch (error: any) {
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

const getCustomerByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return ResponseHandler.badRequest(res, 'Email is missing');
    }
    const customer = await customerService.getCustomerByEmail(email);
    if (!customer) {
      return ResponseHandler.notFound(res, 'Customer not found');
    }
    ResponseHandler.success(res, 'Customer data retrieved successfully', { customer });
  } catch (err) {
    console.error(err);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

const getCustomers = async (req: Request, res: Response) => {
  try {
    const { search, page, offset } = req.query;
    const pageNum = page ? Math.max(Number(page), 1) : 1;
    const limit = offset ? Number(offset) : 25;
    const result = await customerService.getCustomers({
      search: search as string,
      page: pageNum,
      offset: limit,
    });
    ResponseHandler.success(res, 'Customers data retrieved successfully', result);
  } catch (err) {
    console.error(err);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return ResponseHandler.badRequest(res);
    }
    const customer = await customerService.findCustomerById(parseInt(id));
    if (!customer) {
      return ResponseHandler.notFound(res, 'Customer not found');
    }
    const vehicles = await vehicleService.getVehiclesByCustomerId(customer.id);
    if (vehicles.length > 0) {
      return ResponseHandler.conflict(res, `Customer can't be deleted`);
    }
    await customerService.deleteCustomer(parseInt(id));
    res.status(204).send();
  } catch (error) {
    console.error(error);
    ResponseHandler.serverError(res, 'Failed to delete customer');
  }
};

export default {
  createCustomer,
  getCustomerByEmail,
  getCustomer,
  getCustomers,
  deleteCustomer,
};

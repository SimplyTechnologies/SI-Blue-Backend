import { NextFunction, Request, Response } from 'express';
import { CustomerSchema } from '../schemas/customersSchema';
import { customerService, vehicleService } from '../services';
import { ResponseHandler } from '../handlers/errorHandler';

declare global {
  namespace Express {
    interface Request {
      vehicleId: number;
      customerId: number;
      customer?: any;
    }
  }
}

export const validateCustomerByEmail = (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.query.email;
    if (!email || typeof email !== 'string') {
      return ResponseHandler.badRequest(res, 'Email is missing or not a valid string');
    }

    const EmailSchema = CustomerSchema.pick({ email: true });
    EmailSchema.parse({ email });

    next();
  } catch (err) {
    console.error('Email validation error:', err);
    ResponseHandler.badRequest(res, 'Invalid email format');
  }
};

export const validateCustomerRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = CustomerSchema.safeParse(req.body);

    if (!result.success) {
      return ResponseHandler.badRequest(
        res,
        'Validation failed',
        result.error.errors.map(err => err.message),
      );
    }

    const { email, firstName, lastName, phoneNumber, vehicleId } = result.data;
    const vehicle = await vehicleService.getVehicleById(vehicleId);
    if (vehicle?.customerId) {
      return ResponseHandler.badRequest(res, 'Vehicle already assigned');
    }

    const existedCar = await vehicleService.getVehicleById(vehicleId);

    if (!existedCar) {
      return ResponseHandler.badRequest(res, 'Vehicle not found');
    }

    const existingCustomer = await customerService.getCustomerByEmail(email);

    if (existingCustomer) {
      if (vehicle?.customerId) {
        return ResponseHandler.badRequest(res, 'Vehicle already assigned');
      }

      req.customerId = existingCustomer.id;
      req.vehicleId = vehicleId;

      return next();
    }

    const customer = {
      email,
      firstName,
      lastName,
      phoneNumber,
      vehicleId,
    };

    req.customer = customer;
    next();
  } catch (error) {
    console.error('Customer registration validation error:', error);
    ResponseHandler.serverError(res, 'Internal server error');
  }
};

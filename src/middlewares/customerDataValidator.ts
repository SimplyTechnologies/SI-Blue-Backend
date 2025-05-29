import { NextFunction, Request, Response } from 'express';
import { CustomerSchema } from '../schemas/customersSchema';
import { customerService, vehicleService } from '../services';

declare global {
  namespace Express {
    interface Request {
      customer?: any;
    }
  }
}

export const validateCustomerByEmail = (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.query.email;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is missing or not a valid string' });
    }

    const EmailSchema = CustomerSchema.pick({ email: true });
    EmailSchema.parse({ email });

    next();
  } catch (err) {
    console.error('Email validation error:', err);
    res.status(400).json({
      message: 'Invalid email format',
    });
  }
};

export const validateCustomerRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = CustomerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.errors.map(err => err.message),
      });
    }

    const { email, firstName, lastName, phoneNumber, vehicleId } = result.data;

    const existingCustomer = await customerService.getCustomerByEmail(email);
    const existedCar = await vehicleService.getVehicleById(vehicleId);
    if (!existedCar) {
      return res.status(401).json({ message: 'Car missing' });
    }
    if (existingCustomer) {
      req.customer = existingCustomer;
      next();
    }

    const customer = {
      email,
      firstName,
      lastName,

      phoneNumber,
    };

    req.customer = customer;

    next();
  } catch (error) {
    console.error('Customer registration validation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const assignVehicleExistedCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existingCustomer = req.customer;
    const { vehicleId } = req.body;
    if (!existingCustomer) {
      return res.status(400).json({ message: 'Customer data missing' });
    }
    if (!vehicleId) {
      return res.status(400).json({ message: 'Vehicle data missing' });
    }
    const customerId = existingCustomer.id;
    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID required' });
    }
  } catch (err) {}
};

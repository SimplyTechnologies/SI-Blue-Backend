import { NextFunction, Request, Response } from 'express';
import { CustomerSchema } from '../schemas/customersSchema';
import { customerService, vehicleService } from '../services';

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
    const vehicle = await vehicleService.getVehicleById(vehicleId);
      if (vehicle?.returnedData.customerId) {
        return res.status(400).json({ message: 'Vehicle already assigned' });
      }

    const existedCar = await vehicleService.getVehicleById(vehicleId);
    
    if (!existedCar) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const existingCustomer = await customerService.getCustomerByEmail(email);

    if (existingCustomer) {
      if (vehicle?.returnedData.customerId) {
        return res.status(400).json({ message: 'Vehicle already assigned' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

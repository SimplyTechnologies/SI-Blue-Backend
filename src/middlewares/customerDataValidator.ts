import { NextFunction, Request, Response } from "express";
import { CustomerSchema } from "../schemas/customersSchema";
import { customerService, vehicleService } from "../services";
import { Customer } from "../models/customersModel";

export const validateCustomerRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = CustomerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.errors.map(err => err.message),
      });
    }

    const { email, firstName, lastName, phoneNumber, vehicleId } = result.data;

    const existingCustomer = await customerService.getCustomerByEmail(email)
    const existedCar = await vehicleService.getVehicleById(vehicleId)
    if(!existedCar) {
      return res.status(401).json({message: 'Car missing'})
    }
    if (existingCustomer) {
      req.customer = existingCustomer
      next()
    }

    
    const customer = {
      email,
      firstName,
      lastName,

      phoneNumber
    };

    req.customer = customer;

    next();
  } catch (error) {
    console.error('Customer registration validation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const assignVehicleExistedCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const existingCustomer = req.customer
  if(!existingCustomer){
    return res.status(400).json({message: 'Customer data missing'})
  }

  



}
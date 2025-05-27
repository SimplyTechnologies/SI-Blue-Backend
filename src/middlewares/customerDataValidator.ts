import { Response, Request } from 'express';

import { customerService } from '../services/index.js';
import { NextFunction } from 'express';

export const customerDataValidate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email;
    const founded = customerService.getCustomerByEmail(email);
    if (!founded) {
      throw new Error('Customer already exists');
    }

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneNumber = req.body.phoneNumber;

    const customerData = {
      firstName,
      lastName,
      phoneNumber,
      email,
    };

    req.user = customerData;

    next();
  } catch (err: unknown) {
    console.error(err);
    res.status(400).json({ message: 'Please provide us name, surname, phonenumber and email' });
  }
};

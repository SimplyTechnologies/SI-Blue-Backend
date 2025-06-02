import { NextFunction, Request, RequestHandler, Response } from 'express';
import { customerService, vehicleService } from '../services';
import pDebounce from 'p-debounce';

const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.customerId) {
      const customerId = req.customerId;
      const vehicleId = req.vehicleId;

      const updated = await vehicleService.updateVehicleByCustomerId(customerId, vehicleId);

      return res.status(200).json({ message: 'Vehicle updated successfully for existing customer' });
    }

    const customer = req.customer;
    if (!customer) {
      return res.status(400).json({ message: 'Customer data missing' });
    }

    const newCustomer = await customerService.createCustomer(customer);
    await vehicleService.updateVehicleByCustomerId(newCustomer.id, req.body.vehicleId);
    res.status(201).json({
      message: 'Customer created successfully',
      customer: newCustomer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const debouncedSearch = pDebounce(customerService.searchDatabase, 300);

const getCustomer = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const customers = await debouncedSearch(email as string);

    if (!customers) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ customers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
const getCustomerByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ message: 'Email missing' });
    }
    const customer = await customerService.getCustomerByEmail(email);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, page, offset } = req.query;
        const pageNum = page ? Math.max(Number(page), 1) : 1;
        const limit = offset ? Number(offset) : 25;
        const result = await customerService.getCustomers({
            search: search as string,
            page: pageNum,
            offset: limit
        });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default {
  createCustomer,
  getCustomerByEmail,
  getCustomer,
  getCustomers
};

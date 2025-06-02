import { NextFunction, Request, RequestHandler, Response } from "express";
import { customerService } from "../services";

const createCustomer =async (req:Request, res: Response, next: NextFunction) => {
    try {
        const customer  = req.body
        if(!customer) {
            return res.status(400).json({message: 'Customer data missing'})

        }
        await customerService.createCustomer(customer)
        res.status(201).json({message: 'Customer created successfully'})

    } catch (err) {
        console.error(err)
         res.status(500).json({message: 'Internal server error'})
    }

}

const getCustomerByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const  email  = req.query.email as string
        if(!email) {
            return res.status(400).json({message: 'Email missing'})
        }
        const customer = await customerService.getCustomerByEmail(email)
        if(!customer) {
            return res.status(404).json({message: 'Customer not found'})
        }
        res.status(200).json(customer )

    } catch (err) {
        console.error(err)
        return res.status(500).json({message: 'Internal server error'})
    }

}

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
    getCustomers
}

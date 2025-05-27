import { NextFunction, Request, Response } from "express";
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
        return res.status(500).json({message: 'Internal server error'})
    }
    
}

export default {
    createCustomer
}

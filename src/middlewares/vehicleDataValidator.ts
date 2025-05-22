import { NextFunction, Request, Response } from "express";

export const validateInputVehicle = (req: Request, res: Response, next: NextFunction) => {
    const vehicle = req.body
}
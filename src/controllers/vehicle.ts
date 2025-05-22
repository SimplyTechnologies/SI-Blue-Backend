import {  Request, Response} from "express";
import  vehicleService  from "../services/vehicle.js";

const createVehicle = async (req: Request, res: Response) => {
    const vehicle = await vehicleService.createVehicle(req.body.vehicle)


}

const getVehicleByVin = async (req: Request, res: Response) => {

}

export default {
    createVehicle,
    getVehicleByVin
}
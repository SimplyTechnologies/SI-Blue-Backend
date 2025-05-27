import { Router } from "express";
import vehicleController from '../controllers/vehicle.js'
import { authenticateToken, validateInputVehicle } from "../middlewares/vehicleDataValidator.js";

const router = Router()


router.post('/vehicle', validateInputVehicle,vehicleController.createVehicle )

router.get('get-vehicle', vehicleController.getVehicleByVin)
export default router
import { Router } from "express";
import vehicleController from '../controllers/vehicle.js'

const router = Router()


router.post('/vehicle',vehicleController.createVehicle )

router.get('get-vehicle', vehicleController.getVehicleByVin)
export default router
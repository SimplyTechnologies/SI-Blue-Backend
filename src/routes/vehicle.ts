import { Router } from 'express';
import vehicleController from '../controllers/vehicle.js';

const router = Router();

router.post('/vehicle', vehicleController.createVehicle);

router.get('get-vehicle', vehicleController.getVehicleByVin);

router.get('', vehicleController.getVehicles);

router.get('/export', vehicleController.exportVehiclesCsv);

router.get('/makes', vehicleController.getAllMakes);

router.get('/models', vehicleController.getModelsByMakeId);

export default router;

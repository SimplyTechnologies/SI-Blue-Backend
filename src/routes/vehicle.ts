import { Router } from 'express';
import makeController from '../controllers/make';
import modelController from '../controllers/model';
import vehicleController from '../controllers/vehicle';
import { validateInputVehicle } from '../middlewares/vehicleDataValidator';

const router = Router();

router.post('/vehicle', validateInputVehicle, vehicleController.createVehicle);

router.get('get-vehicle', vehicleController.getVehicleByVin);

router.get('', vehicleController.getVehicles);

router.get('/export', vehicleController.exportVehiclesCsv);

router.get('/makes', makeController.getAllMakes);

router.get('/models', modelController.getModelsByMakeId);

export default router;

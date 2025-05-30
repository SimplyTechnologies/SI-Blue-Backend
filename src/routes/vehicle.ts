import { Router } from 'express';
import makeController from '../controllers/make';
import modelController from '../controllers/model';
import vehicleController from '../controllers/vehicle';
import { validateInputVehicle, authenticateToken } from '../middlewares/vehicleDataValidator';
import { decodeVin } from '../controllers/vinController';

const router = Router();

router.post('/vehicle', validateInputVehicle, vehicleController.createVehicle);

router.get('get-vehicle', vehicleController.getVehicleByVin);

router.get('/', authenticateToken, vehicleController.getVehicles);

router.get('/export', authenticateToken, vehicleController.exportVehiclesCsv);

router.get('/makes', makeController.getAllMakes);

router.get('/models', modelController.getModelsByMakeId);

router.get('/dashboard-data', vehicleController.getAllVehicleLocations);

router.post('/decode/vin', decodeVin);

export default router;

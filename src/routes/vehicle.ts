import { Router } from 'express';
import makeController from '../controllers/make';
import modelController from '../controllers/model';
import vehicleController from '../controllers/vehicle';
import { validateInputVehicle, authenticateToken } from '../middlewares/vehicleDataValidator';

const router = Router();

router.post('/vehicle', validateInputVehicle, vehicleController.createVehicle);

router.get('get-vehicle', vehicleController.getVehicleByVin);

router.get('/', authenticateToken, vehicleController.getVehicles);

router.get('/export', authenticateToken, vehicleController.exportVehiclesCsv);

router.get('/makes', makeController.getAllMakes);

router.get('/models', modelController.getModelsByMakeId);

export default router;

import { Router } from 'express';
import customerController from '../controllers/customer.js'


const router = Router();

router.post('/register', customerController.createCustomer);

export { router as customersRouter };

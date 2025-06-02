import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateCustomerByEmail, validateCustomerRegistration } from '../middlewares/customerDataValidator';
import customerController from '../controllers/customer';

const router = Router();

router.use(authenticateToken);

router.post('/customer', validateCustomerRegistration, customerController.createCustomer);

router.get('/', validateCustomerByEmail, customerController.getCustomerByEmail);

router.get('/get-customers', customerController.getCustomers);

export default router;

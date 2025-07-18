import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateCustomerRegistration } from '../middlewares/customerDataValidator';
import customerController from '../controllers/customer';

const router = Router();
router.use(authenticateToken)


router.post('/customer', validateCustomerRegistration, customerController.createCustomer);

router.get('/search', customerController.getCustomer);

router.get('/get-customers', customerController.getCustomers);

router.delete('/:id', customerController.deleteCustomer);

export default router;

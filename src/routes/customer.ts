import { Router} from 'express'
import { validateCustomerByEmail, validateCustomerRegistration } from '../middlewares/customerDataValidator'
import customerController from '../controllers/customer'

const router = Router()

router.post('/customer', validateCustomerRegistration, customerController.createCustomer )
router.get('/search', customerController.getCustomer )

export default router

import { Router} from 'express'
import { validateCustomerByEmail, validateCustomerRegistration } from '../middlewares/customerDataValidator'
import customerController from '../controllers/customer'

const router = Router()

router.post('/customer', validateCustomerRegistration, customerController.createCustomer )
router.get('/',validateCustomerByEmail, customerController.getCustomerByEmail )

export default router

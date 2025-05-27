import { Router} from 'express'
import { validateCustomerRegistration } from '../middlewares/customerDataValidator'
import customerController from '../controllers/customer'

const router = Router()

router.post('/customer', validateCustomerRegistration, customerController.createCustomer )

export default router

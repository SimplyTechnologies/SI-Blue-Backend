import {Router} from "express"
import customerDataValidate from "../middlewares/customerDataValidator.js"
import {customerController} from "../controllers/index.js"

const router = Router()


router.post("/register",customerController.createCustomer)

export  { router as customersRouter}

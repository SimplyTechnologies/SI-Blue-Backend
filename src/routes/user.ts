import {Router} from "express"
import { userController } from "../controllers/index.js"
import {registerUser} from "../middlewares/auth.js"

const router = Router()

router.post("/register",registerUser, userController.registerUser)

router.post("/login", userController.loginUser)


export default router
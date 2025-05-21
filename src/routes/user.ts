import { Router } from 'express';
import { authController, userController } from '../controllers/index.js';
import { registerUser } from '../middlewares/auth.js';
import { verifyAccessToken, checkRole} from '../middlewares/accesTokenAuthMiddleware.js'
import { userService } from '../services/index.js';


const router = Router();

router.post('/register', registerUser, authController.registerUser);

router.post('/login', authController.loginUser);

router.post('/refresh-token', authController.refreshAccessToken)

router.get('/users', checkRole('admin'), userController.getAllUsers)

router.get('/profile', userController.getUserById)

router.post('/logout', authController.logoutUser);


export default router;

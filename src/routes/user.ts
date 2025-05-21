import { Router } from 'express';
import userController from '../controllers/user.js';

const router = Router();

//router.get('/users', checkRole('admin'), userController.getAllUsers)

router.get('/profile', userController.getUserById);

export default router;

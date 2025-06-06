import { Router } from 'express';
import userController from '../controllers/user'

const router = Router();
 router.post('user', userController.createUser)
 router.get('/:userId', userController.getUserById)
 router.get('', userController.getUsers)

export default router;

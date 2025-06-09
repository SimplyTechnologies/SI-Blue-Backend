import { Router } from 'express';
import userController from '../controllers/user';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('user', userController.createUser);

router.put('/update-user', userController.updateUser);

router.get('/:userId', userController.getUserById);

router.get('', userController.getUsers);

export default router;

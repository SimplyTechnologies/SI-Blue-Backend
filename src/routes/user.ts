import { Router } from 'express';
import userController from '../controllers/user';
import { pendingUserDataValidateUserData } from '../middlewares/pendingUsersDataValidator';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/add-user', pendingUserDataValidateUserData, userController.addNewUser);

router.put('/update-user', authenticateToken, userController.updateUser);

router.delete('/deactivate-user/:id',requireAdmin, userController.deleteInactiveUser);
router.get('/:userId', authenticateToken, userController.getUserById);

router.get('', authenticateToken, userController.getUsers);
router.get('/user/:token', userController.getUserById);

export default router;

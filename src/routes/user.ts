import { Router } from 'express';
import userController from '../controllers/user';
import { pendingUserDataValidateUserData } from '../middlewares/pendingUsersDataValidator';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';
import { avatarUploadMiddleware } from '../middlewares/avatarUpload';

const router = Router();

router.post('/add-user', authenticateToken, requireAdmin, pendingUserDataValidateUserData, userController.addNewUser);

router.put('/update-user', authenticateToken, userController.updateUser);

router.delete('/deactivate-user/:id', authenticateToken, requireAdmin, userController.deleteInactiveUser);

router.get('', authenticateToken, requireAdmin, userController.getUsers);
router.get('/user/:token', userController.getUserById);

router.post('/upload-avatar/:id', authenticateToken, avatarUploadMiddleware, userController.uploadAvatar);

router.delete('/delete-avatar/:id', authenticateToken, userController.deleteAvatar);

export default router;

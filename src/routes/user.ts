import { Router } from 'express';
import userController from '../controllers/user';
import { pendingUserDataValidateUserData } from '../middlewares/pendingUsersDataValidator';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/imageUpload';

const router = Router();

router.post('/add-user', authenticateToken, requireAdmin, pendingUserDataValidateUserData, userController.addNewUser);

router.put('/update-user', authenticateToken, userController.updateUser);

router.delete('/deactivate-user/:id', authenticateToken, requireAdmin, userController.deleteInactiveUser);

router.get('', authenticateToken, requireAdmin, userController.getUsers);
router.get('/user/:token', userController.getUserById);

router.post('/upload-avatar/:id', authenticateToken, upload.single('avatar'), userController.uploadAvatar);

export default router;

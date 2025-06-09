import { Router } from 'express';
import userController from '../controllers/user'
import { pendingUserDataValidateUserData } from '../middlewares/pendingUsersDataValidator';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
router.use(authenticateToken);

router.post('/activate-account',pendingUserDataValidateUserData, userController.addNewUser)

router.put('/update-user', userController.updateUser);

router.delete('/user/:id', userController.deleteInactiveUser)

export default router;

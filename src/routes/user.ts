import { Router } from 'express';
import userController from '../controllers/user'
import { pendingUserDataValidateUserData } from '../middlewares/pendingUsersDataValidator';

const router = Router();

router.post('/user',pendingUserDataValidateUserData, userController.addNewUser)


export default router;

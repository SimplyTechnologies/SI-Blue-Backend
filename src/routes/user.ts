import { Router } from 'express';
import userController from '../controllers/user'
import { validateUserData } from '../middlewares/usersDataValidator';

const router = Router();

router.post('/user',validateUserData, userController.addNewUser)


export default router;

import { Router } from 'express';
import userActivityController from '../controllers/userActivity';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', userActivityController.getUserActivity);

export default router;


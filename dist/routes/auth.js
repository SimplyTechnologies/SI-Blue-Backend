import Router from 'express';
import { authenticateRefreshToken, validateRegistration } from '../middlewares/authMiddleware.js';
import authController from '../controllers/auth.js';
const router = Router();
router.post('/register', validateRegistration, authController.registerUser);
router.post('/login', authController.login);
router.post('/refresh-token', authenticateRefreshToken, authController.refreshToken);
export default router;
//# sourceMappingURL=auth.js.map
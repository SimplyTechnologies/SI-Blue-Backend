import Router from 'express';
import {
  authenticateRefreshToken,
  validateAccountActivation,
  validateLogin,
  validateRegistration,
} from '../middlewares/authMiddleware.js';
import authController from '../controllers/auth.js';

const router = Router();

router.post('/register', validateRegistration, authController.registerUser);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password', authController.resetPassword);
router.post('/login', validateLogin, authController.login);
router.post('/activate-account', validateAccountActivation, authController.activateAccount);
router.post('/refresh-token', authenticateRefreshToken, authController.refreshToken);

export default router;


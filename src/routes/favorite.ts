import { Router } from 'express';
import { createFavorite,  getFavoritesByUserId, deleteFavoriteById } from '../controllers/favorite';
import { authenticateToken } from '../middlewares/vehicleDataValidator';

const router = Router();

router.post('/', authenticateToken, createFavorite);
router.get('/:userId', getFavoritesByUserId);
router.delete('/:vehicleId', authenticateToken, deleteFavoriteById);

export default router;

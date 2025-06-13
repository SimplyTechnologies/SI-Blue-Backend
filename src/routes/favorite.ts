import { Router } from 'express';
import { createFavorite, getFavoritesByUserId, deleteFavoriteById } from '../controllers/favorite';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/', createFavorite);

router.get('/:userId', getFavoritesByUserId);

router.delete('/:vehicleId', deleteFavoriteById);

export default router;

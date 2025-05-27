import { Router } from 'express';
import { createFavorite,  getFavoritesByUserId, deleteFavoriteById } from '../controllers/favorite';

const router = Router();

router.post('/', createFavorite);
router.get('/:userId', getFavoritesByUserId);
router.delete('/', deleteFavoriteById);

export default router;

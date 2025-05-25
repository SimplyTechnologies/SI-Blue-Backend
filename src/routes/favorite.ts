import { Router } from 'express';
import { createFavorite, deleteFavoriteById } from '../controllers/favorite';

const router = Router();

router.post('/', createFavorite);
router.delete('/', deleteFavoriteById);

export default router;

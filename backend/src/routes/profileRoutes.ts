import { Router } from 'express';
import { getProfile, updateProfile, changePassword, getMyEvents, getMyReviews, getMyBookmarks } from '../controllers/profileController';
import { auth } from '../middleware/authMiddleware';

const router = Router();

// Protection des routes
router.use(auth);

// Routes du profil
router.get('/', getProfile);
router.patch('/', updateProfile);
router.post('/change-password', changePassword);

// Routes associées
router.get('/events', getMyEvents);
router.get('/reviews', getMyReviews);
router.get('/bookmarks', getMyBookmarks);

export default router; 
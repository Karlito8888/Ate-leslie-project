import express from 'express';
import { admin, auth } from '../middleware/authMiddleware';
import { inbox, sent, send, markAsRead } from '../controllers/adminMessageController';

const router = express.Router();

// Appliquer l'authentification et le rôle admin à toutes les routes
router.use(auth);
router.use(admin);

// Routes pour les messages internes des admins
router.get('/inbox', inbox);
router.get('/sent', sent);
router.post('/', send);
router.patch('/:id/read', markAsRead);

export default router; 
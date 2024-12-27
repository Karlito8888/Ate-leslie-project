// backend/src/routes/adminRoutes.ts

import { Router, RequestHandler } from 'express';
import { 
  stats, list, delUser, getMessages, reply, assign, status 
} from '../controllers/adminController';
import { auth, admin } from '../middleware/authMiddleware';

const router = Router();

// Protection des routes admin
router.use(auth as RequestHandler);
router.use(admin as RequestHandler);

// Routes de gestion des utilisateurs
router.get('/users', list as RequestHandler);
router.delete('/users/:id', delUser as RequestHandler);

// Routes de gestion des messages
router.get('/messages', getMessages as RequestHandler);
router.patch('/messages/:id/assign', assign as RequestHandler);
router.patch('/messages/:id/status', status as RequestHandler);
router.post('/messages/:id/reply', reply as RequestHandler);

// Statistiques
router.get('/stats', stats as RequestHandler);

export default router; 
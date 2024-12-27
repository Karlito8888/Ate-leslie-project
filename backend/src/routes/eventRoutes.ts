// backend/src/routes/eventRoutes.ts

import { Router } from 'express';
import { list, create, update, remove } from '../controllers/eventController';
import { AuthHandler } from '../types/express';
import { validateEvent } from '../middleware/eventValidation';
import { auth } from '../middleware/authMiddleware';
import reviewRoutes from './reviewRoutes';

const router = Router();

// Routes publiques
router.get('/', list as AuthHandler);

// Routes authentifiées
router.use(auth);
router.post('/', validateEvent, create as AuthHandler);
router.put('/:id', validateEvent, update as AuthHandler);
router.delete('/:id', remove as AuthHandler);

// Routes des reviews
router.use('/:eventId/reviews', reviewRoutes);

export default router; 
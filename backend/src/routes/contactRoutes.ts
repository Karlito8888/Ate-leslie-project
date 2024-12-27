import { Router, RequestHandler } from 'express';
import { add, list, edit } from '../controllers/contactController';
import { auth, admin } from '../middleware/authMiddleware';
import { validate } from '../middleware/contactValidation';

const router = Router();

// Route publique pour envoyer un message
router.post('/', validate as RequestHandler, add as RequestHandler);

// Routes admin
router.use(auth as RequestHandler);
router.use(admin as RequestHandler);

router.get('/', list as RequestHandler);
router.patch('/:id', edit as RequestHandler);

export default router; 
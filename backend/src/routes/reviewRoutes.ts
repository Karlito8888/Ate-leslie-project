import { Router, RequestHandler } from 'express';
import { add } from '../controllers/reviewController';
import { auth } from '../middleware/authMiddleware';
import { validate } from '../middleware/reviewValidation';

const router = Router({ mergeParams: true }); // Pour accéder aux params de la route parent

router.use(auth as RequestHandler);

router.post('/', validate as RequestHandler, add as RequestHandler);

export default router; 
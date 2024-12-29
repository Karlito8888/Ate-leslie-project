// backend/src/routes/authRoutes.ts

import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController';
import { validateAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;

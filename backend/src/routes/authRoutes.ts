// backend/src/routes/authRoutes.ts

import { Router } from 'express';
import { login, register, forgotPassword, resetPassword } from '../controllers/authController';
import { validateLogin, validateRegister, validatePasswordReset } from '../middleware/authValidation';

const router = Router();

// Routes publiques
router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', validatePasswordReset, resetPassword);

export default router;

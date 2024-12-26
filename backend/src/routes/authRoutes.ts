// backend/src/routes/authRoutes.ts

import { Router } from 'express';
import { register, login, me, edit } from '../controllers/authController';
import { auth } from '../middleware/authMiddleware';
import { register as regValid, login as loginValid, editProfile as editValid } from '../middleware/authValidation';

const r = Router();

// Public routes
r.post('/register', regValid, register);
r.post('/login', loginValid, login);

// Protected routes
r.use(auth);
r.get('/me', me);
r.patch('/me', editValid, edit);

export default r;

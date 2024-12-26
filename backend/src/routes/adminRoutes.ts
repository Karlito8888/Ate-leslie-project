// backend/src/routes/adminRoutes.ts

import { Router } from 'express';
import { stats, users, delUser, msgs, assign, status } from '../controllers/adminController';
import { auth, admin } from '../middleware/authMiddleware';

const r = Router();

r.use(auth, admin);

r.get('/stats', stats);
r.get('/users', users);
r.delete('/users/:id', delUser);
r.get('/msgs', msgs);
r.post('/msgs/:id/assign', assign);
r.put('/msgs/:id/status', status);

export default r; 
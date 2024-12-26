// backend/src/routes/eventRoutes.ts

import { Router } from 'express';
import { add, list, get, edit, del, join, leave } from '../controllers/eventController';
import { auth } from '../middleware/authMiddleware';
import { validate } from '../middleware/eventValidation';
import { upload } from '../utils/uploadHandler';

const r = Router();

// Public routes
r.get('/', list);
r.get('/:id', get);

// Protected routes
r.use(auth);
r.post('/', upload.array('img', 5), validate, add);
r.patch('/:id', upload.array('img', 5), validate, edit);
r.delete('/:id', del);
r.post('/:id/join', join);
r.post('/:id/leave', leave);

export default r; 
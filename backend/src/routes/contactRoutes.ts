import { Router } from 'express';
import { add, list, edit } from '../controllers/contactController';
import { auth, admin } from '../middleware/authMiddleware';
import { validate } from '../middleware/contactValidation';

const r = Router();

r.post('/', validate, add);

r.use(auth, admin);
r.get('/', list);
r.patch('/:id', edit);

export default r; 
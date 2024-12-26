// backend/src/middleware/authMiddleware.ts

import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const auth = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('No token');

    const decoded = jwt.verify(token, 'secret') as any;
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send('No user');

    req.user = user;
    next();
  } catch {
    res.status(401).send('Bad token');
  }
};

export const admin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') return res.status(403).send('No');
  next();
}; 
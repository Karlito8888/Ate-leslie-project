// backend/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from '../utils/auth';
import { error } from '../utils/responseHandler';
import { User } from '../models/User';
import { AuthRequest } from '../types/express';

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Auth headers:', req.headers.authorization);
    const token = extractToken(req.headers.authorization || '');
    console.log('Extracted token:', token);
    
    if (!token) {
      error(res, 401, 'Non authentifié');
      return;
    }

    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded);
    const user = await User.findById(decoded.id).select('-password');
    console.log('Found user:', user);
    
    if (!user || typeof user.role !== 'string') {
      error(res, 401, 'Token invalide');
      return;
    }

    const userObj = user.toObject();
    (req as AuthRequest).user = {
      _id: user._id,
      id: user._id.toString(),
      role: user.role,
      username: userObj.username,
      email: userObj.email
    };
    console.log('Added user to request:', (req as AuthRequest).user);
    
    next();
  } catch (err) {
    console.error('Auth error:', err);
    error(res, 401, 'Non autorisé');
  }
};

export const admin = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthRequest;
  console.log('Admin check - user:', authReq.user);
  if (!authReq.user?.role || authReq.user.role !== 'admin') {
    error(res, 403, 'Accès réservé aux administrateurs');
    return;
  }
  next();
}; 
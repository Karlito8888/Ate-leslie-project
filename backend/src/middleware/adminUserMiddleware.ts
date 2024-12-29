import { Request, Response, NextFunction } from 'express';
import { auth, admin } from './authMiddleware';

// Middleware de validation pour la création/modification d'utilisateur
export const validateUserData = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, role } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Données utilisateur incomplètes' });
  }

  if (role && !['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }

  next();
};

// Export des middlewares combinés
export const adminUserMiddlewares = [auth, admin, validateUserData]; 
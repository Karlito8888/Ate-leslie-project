import { Request, Response, NextFunction } from 'express';
import { auth, admin } from './authMiddleware';

// Middleware de validation pour les messages de contact
export const validateContactData = (req: Request, res: Response, next: NextFunction) => {
  const { email, subject, message } = req.body;
  
  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Données de contact incomplètes' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  next();
};

// Export des middlewares combinés
export const adminContactMiddlewares = [auth, admin, validateContactData]; 
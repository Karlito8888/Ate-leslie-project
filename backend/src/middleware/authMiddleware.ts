// backend/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT } from '../index';
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'user' | 'admin';
      };
    }
  }
}

interface JwtPayload {
  id: string;
}

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email et mot de passe requis' 
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      error: 'Mot de passe trop court' 
    });
  }

  next();
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, JWT.SECRET) as JwtPayload;
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Accès admin requis' });
  }
  next();
}; 
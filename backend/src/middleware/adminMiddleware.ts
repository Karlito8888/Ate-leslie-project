import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user: {
    _id: Types.ObjectId;
    id: string;
    role: 'user' | 'admin';
    username: string;
    email: string;
  };
}

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accès non autorisé" });
  }
  next();
}; 
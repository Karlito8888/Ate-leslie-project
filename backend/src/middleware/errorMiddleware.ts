import { Request, Response, NextFunction } from 'express';
import { config } from '../index';

// Error handler
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ 
    error: config.app.IS_DEV ? err.message : 'Erreur serveur' 
  });
};

// Not found handler
export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route non trouvée' });
}; 
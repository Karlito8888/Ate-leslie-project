import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from './authMiddleware';

// Middleware de validation pour les avis
export const validateReviewData = [
  body('rating')
    .exists().withMessage('La note est requise')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note doit être comprise entre 1 et 5'),

  body('comment')
    .exists().withMessage('Le commentaire est requis')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Le commentaire doit contenir au moins 3 caractères'),

  // Validation des erreurs
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

// Export des middlewares combinés
export const reviewMiddlewares = [auth, ...validateReviewData]; 
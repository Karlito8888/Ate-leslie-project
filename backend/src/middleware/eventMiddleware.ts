import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { auth } from './authMiddleware';

// Validation d'ID MongoDB
export const validateEventId = param('id')
  .exists()
  .custom((value) => Types.ObjectId.isValid(value))
  .withMessage('ID d\'événement invalide');

// Middleware de validation pour les événements
export const validateEventData = [
  body('title')
    .exists().withMessage('Le titre est requis')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Le titre doit faire au moins 3 caractères'),

  body('description')
    .exists().withMessage('La description est requise')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La description doit faire au moins 10 caractères'),

  body('date')
    .exists().withMessage('La date est requise')
    .custom((value) => {
      const date = new Date(value);
      return date > new Date();
    })
    .withMessage('La date doit être dans le futur'),

  body('location')
    .exists().withMessage('Le lieu est requis')
    .trim()
    .notEmpty()
    .withMessage('Le lieu ne peut pas être vide'),

  body('category')
    .optional()
    .isIn(['workshop', 'conference', 'meetup', 'other'])
    .withMessage('La catégorie doit être : workshop, conference, meetup ou other'),

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
export const eventMiddlewares = [auth, ...validateEventData];
export const eventUpdateMiddlewares = [auth, validateEventId, ...validateEventData]; 
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { error } from '../utils/responseHandler';

export const validateProfileUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Format d\'email invalide')
    .normalizeEmail(),

  body('newsletterSubscribed')
    .optional()
    .isBoolean()
    .withMessage('La valeur newsletterSubscribed doit être un booléen'),

  body('mobileNumber')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value);
    })
    .withMessage('Format de numéro de mobile invalide'),

  body('landlineNumber')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value);
    })
    .withMessage('Format de numéro fixe invalide'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, 400, errors.array()[0].msg);
    }
    return next();
  }
]; 
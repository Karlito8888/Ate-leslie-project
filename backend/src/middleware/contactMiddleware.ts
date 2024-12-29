import { Request, Response, NextFunction } from 'express';

export const validateContact = (req: Request, res: Response, next: NextFunction) => {
  const { email, subject, message } = req.body;

  // Valider l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Email invalide" });
  }

  // Valider le sujet
  if (!subject || subject.trim().length < 3) {
    return res.status(400).json({ message: "Le sujet doit contenir au moins 3 caractères" });
  }

  // Valider le message
  if (!message || message.trim().length < 10) {
    return res.status(400).json({ message: "Le message doit contenir au moins 10 caractères" });
  }

  next();
}; 
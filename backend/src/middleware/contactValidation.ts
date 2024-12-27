import { Request, Response, NextFunction } from 'express';

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { name, email, msg } = req.body;
  
  if (!name || name.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Le nom doit faire au moins 2 caractères'
    });
  }

  if (!email || !email.match(/^[^@]+@[^@]+\.[a-z]{2,}$/i)) {
    return res.status(400).json({
      success: false,
      error: 'Email invalide'
    });
  }

  if (!msg || msg.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Le message doit faire au moins 10 caractères'
    });
  }
  
  next();
  return;
}; 
import { Request, Response, NextFunction } from 'express';

export const validateEvent = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { title, desc, date, category } = req.body;
  
  if (!title || title.length < 3) {
    return res.status(400).json({ 
      success: false, 
      error: 'Le titre doit faire au moins 3 caractères' 
    });
  }

  if (!desc || desc.length < 10) {
    return res.status(400).json({ 
      success: false, 
      error: 'La description doit faire au moins 10 caractères' 
    });
  }

  if (!date || new Date(date) < new Date()) {
    return res.status(400).json({ 
      success: false, 
      error: 'La date doit être dans le futur' 
    });
  }

  if (!category || !['workshop', 'conference', 'meetup', 'other'].includes(category)) {
    return res.status(400).json({ 
      success: false, 
      error: 'La catégorie doit être : workshop, conference, meetup ou other' 
    });
  }
  
  next();
  return;
}; 
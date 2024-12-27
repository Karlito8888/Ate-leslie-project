import { Request, Response, NextFunction } from 'express';

export const validateRegister = (
  req: Request, 
  res: Response, 
  next: NextFunction
): Response | void => {
  const { username, email, password } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({ 
      success: false, 
      error: 'Le nom d\'utilisateur doit faire au moins 3 caractères' 
    });
  }

  if (!email || !email.match(/^[^@]+@[^@]+\.[a-z]{2,}$/i)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email invalide' 
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      error: 'Le mot de passe doit faire au moins 6 caractères' 
    });
  }

  next();
  return;
};

export const validateLogin = (
  req: Request, 
  res: Response, 
  next: NextFunction
): Response | void => {
  const { email, password } = req.body;

  if (!email || !email.match(/^[^@]+@[^@]+\.[a-z]{2,}$/i)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email invalide' 
    });
  }

  if (!password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Mot de passe requis' 
    });
  }

  next();
  return;
};

export const validatePasswordChange = (
  req: Request, 
  res: Response, 
  next: NextFunction
): Response | void => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ 
      success: false, 
      error: 'Mot de passe actuel requis' 
    });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ 
      success: false, 
      error: 'Le nouveau mot de passe doit faire au moins 6 caractères' 
    });
  }

  if (!confirmPassword || confirmPassword !== newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Les mots de passe ne correspondent pas'
    });
  }

  next();
  return;
};

export const validatePasswordReset = (
  req: Request, 
  res: Response, 
  next: NextFunction
): Response | void => {
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      error: 'Le mot de passe doit faire au moins 6 caractères' 
    });
  }

  next();
  return;
};

export const editProfile = (req: any, res: any, next: any) => {
  const { username, email } = req.body;

  if (username && username.length < 3) return res.status(400).send('Bad name');
  if (email && !email.includes('@')) return res.status(400).send('Bad email');

  next();
}; 
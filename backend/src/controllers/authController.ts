// backend/src/controllers/authController.ts

import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken, hashPassword } from '../index';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken(user._id);

    res.status(201).json({ 
      success: true,
      data: { token, user: { id: user._id, email: user.email } }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Erreur d\'inscription' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email ou mot de passe incorrect' 
      });
    }

    const token = generateToken(user._id);
    res.json({ 
      success: true,
      data: { token, user: { id: user._id, email: user.email } }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur de connexion' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    const resetToken = generateToken(user._id);
    user.resetToken = resetToken;
    user.resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    res.json({ success: true, message: 'Instructions envoyées par email' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la réinitialisation' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ success: false, error: 'Mot de passe requis' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Token invalide ou expiré' });
    }

    user.password = await hashPassword(password);
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Mot de passe mis à jour' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur de réinitialisation' });
  }
};
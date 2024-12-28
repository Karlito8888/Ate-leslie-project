// backend/src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { hash, check, generateToken, verifyToken } from '../utils/auth';
import { send } from '../utils/email';
import { ok, error } from '../utils/responseHandler';
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/ApiError';

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, newsletterSubscribed = true } = req.body;

  // Validation des champs
  if (!username || !email || !password) {
    throw new ApiError('Tous les champs sont requis', 400);
  }

  if (username.length < 3) {
    throw new ApiError('Le nom d\'utilisateur doit contenir au moins 3 caractères', 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError('Format d\'email invalide', 400);
  }

  if (password.length < 6) {
    throw new ApiError('Le mot de passe doit contenir au moins 6 caractères', 400);
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new ApiError('Cet email ou nom d\'utilisateur est déjà utilisé', 400);
  }

  // Créer le nouvel utilisateur
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    newsletterSubscribed
  });

  // Générer le token
  const token = generateToken(user);

  // Retourner la réponse
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        newsletterSubscribed: user.newsletterSubscribed
      },
      token
    }
  });
};

/**
 * Connexion d'un utilisateur
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Vérifier les identifiants
    const user = await User.findOne({ email });
    if (!user || !(await check(password, user.password))) {
      return next(new ApiError('Email ou mot de passe incorrect', 401));
    }

    // Générer le token
    const token = generateToken(user);

    // Retourner la réponse
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          newsletterSubscribed: user.newsletterSubscribed
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Demande de réinitialisation de mot de passe
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      error(res, 404, 'Aucun compte associé à cet email');
      return;
    }

    // Générer le token de réinitialisation
    const resetToken = generateToken(user._id);
    user.resetToken = resetToken;
    user.resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await user.save();

    // Envoyer l'email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await send(
      email,
      'Réinitialisation de mot de passe',
      `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}`,
      `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href="${resetUrl}">${resetUrl}</a></p>`
    );

    ok(res, {}, 'Email de réinitialisation envoyé');
  } catch (e: any) {
    error(res, 500, e.message || 'Erreur lors de l\'envoi de l\'email');
  }
};

/**
 * Réinitialisation du mot de passe
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Vérifier le token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (e) {
      error(res, 400, 'Token invalide ou expiré');
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      error(res, 400, 'Utilisateur non trouvé');
      return;
    }

    // Mettre à jour le mot de passe
    user.password = await hash(password);
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    ok(res, {}, 'Mot de passe réinitialisé avec succès');
  } catch (e: any) {
    error(res, 400, e.message || 'Token invalide ou expiré');
  }
};
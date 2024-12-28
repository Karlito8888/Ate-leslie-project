import { Request, Response } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { hash, check } from '../utils/auth';

// Obtenir le profil de l'utilisateur connecté
export const getProfile = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).select('-password');
  if (!user) {
    throw new ApiError('Utilisateur non trouvé', 404);
  }
  res.json({
    success: true,
    data: { user }
  });
};

// Mettre à jour le profil
export const updateProfile = async (req: Request, res: Response) => {
  const { username, email, newsletterSubscribed, mobileNumber, landlineNumber } = req.body;
  const updates: any = {};

  if (username) {
    if (username.length < 3) {
      throw new ApiError('Le nom d\'utilisateur doit contenir au moins 3 caractères', 400);
    }
    const existingUsername = await User.findOne({ username, _id: { $ne: req.user?.id } });
    if (existingUsername) {
      throw new ApiError('Ce nom d\'utilisateur est déjà utilisé', 400);
    }
    updates.username = username;
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError('Format d\'email invalide', 400);
    }
    const existingEmail = await User.findOne({ email, _id: { $ne: req.user?.id } });
    if (existingEmail) {
      throw new ApiError('Cet email est déjà utilisé', 400);
    }
    updates.email = email;
  }

  if (typeof newsletterSubscribed === 'boolean') {
    updates.newsletterSubscribed = newsletterSubscribed;
  }

  if (mobileNumber !== undefined) {
    if (mobileNumber && !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobileNumber)) {
      throw new ApiError('Format de numéro de mobile invalide', 400);
    }
    updates.mobileNumber = mobileNumber || null;
  }

  if (landlineNumber !== undefined) {
    if (landlineNumber && !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(landlineNumber)) {
      throw new ApiError('Format de numéro fixe invalide', 400);
    }
    updates.landlineNumber = landlineNumber || null;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError('Aucune donnée valide à mettre à jour', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.user?.id,
    { $set: updates },
    { new: true }
  ).select('-password');

  if (!user) {
    throw new ApiError('Utilisateur non trouvé', 404);
  }

  res.json({
    success: true,
    data: { user }
  });
};

// Changer le mot de passe
export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError('Non authentifié', 401);
  }

  // Vérifier que les nouveaux mots de passe correspondent
  if (newPassword !== confirmPassword) {
    throw new ApiError('Les mots de passe ne correspondent pas', 400);
  }

  // Vérifier l'ancien mot de passe
  const user = await User.findById(userId);
  if (!user || !(await check(currentPassword, user.password))) {
    throw new ApiError('Mot de passe actuel incorrect', 401);
  }

  // Mettre à jour le mot de passe
  user.password = await hash(newPassword);
  await user.save();

  res.json({
    success: true,
    data: {}
  });
}; 
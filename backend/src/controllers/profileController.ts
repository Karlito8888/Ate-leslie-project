import { Request, Response } from 'express';
import { User } from '../models/User';
import { hash, check } from '../utils/auth';
import { error, ok } from '../utils/responseHandler';

// Obtenir le profil de l'utilisateur connecté
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return error(res, 404, 'Utilisateur non trouvé');
    }
    return ok(res, { user });
  } catch (e: any) {
    return error(res, 500, e.message);
  }
};

// Mettre à jour le profil
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { username, email, newsletterSubscribed, mobileNumber, landlineNumber } = req.body;
    const updates: any = {};

    // Construire l'objet de mise à jour avec les champs fournis
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (typeof newsletterSubscribed === 'boolean') updates.newsletterSubscribed = newsletterSubscribed;
    if (mobileNumber !== undefined) updates.mobileNumber = mobileNumber || null;
    if (landlineNumber !== undefined) updates.landlineNumber = landlineNumber || null;

    // Vérifier si des champs ont été fournis
    if (Object.keys(updates).length === 0) {
      return error(res, 400, 'Aucune donnée valide à mettre à jour');
    }

    // Vérifier si le username ou email existe déjà
    if (username || email) {
      const query = {
        _id: { $ne: req.user?.id },
        $or: [] as any[]
      };
      
      if (username) query.$or.push({ username });
      if (email) query.$or.push({ email });
      
      if (query.$or.length > 0) {
        const existing = await User.findOne(query);
        if (existing) {
          const field = existing.username === username ? 'username' : 'email';
          return error(res, 400, `Ce ${field} est déjà utilisé`);
        }
      }
    }

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) {
      return error(res, 404, 'Utilisateur non trouvé');
    }

    return ok(res, { user });
  } catch (e: any) {
    return error(res, 500, e.message);
  }
};

// Changer le mot de passe
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return error(res, 401, 'Non authentifié');
    }

    // Vérifier l'ancien mot de passe
    const user = await User.findById(userId);
    if (!user || !(await check(currentPassword, user.password))) {
      return error(res, 401, 'Mot de passe actuel incorrect');
    }

    // Mettre à jour le mot de passe
    user.password = await hash(newPassword);
    await user.save();

    return ok(res, {});
  } catch (e: any) {
    return error(res, 500, e.message);
  }
}; 
// backend/src/controllers/authController.ts

import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { generateReset } from '../utils/auth';
import { send } from '../utils/email';
import { resetPassword } from '../utils/emailTemplates';
import { ok, error, created } from '../utils/responseHandler';

export const register = async (req: any, res: any) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return error(res, 400, 'Email déjà utilisé');

    const hash = await bcrypt.hash(req.body.password, 8);
    const user = await User.create({ ...req.body, password: hash });
    
    const token = jwt.sign({ id: user._id }, 'secret');
    created(res, { token, user: { id: user._id, email: user.email } });
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de l\'inscription');
  }
};

export const login = async (req: any, res: any) => {
  try {
    const user: any = await User.findOne({ email: req.body.email });
    if (!user) return error(res, 400, 'Email invalide');

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return error(res, 400, 'Mot de passe invalide');

    const token = jwt.sign({ id: user._id }, 'secret');
    ok(res, { token, user: { id: user._id, email: user.email } });
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la connexion');
  }
};

export const me = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user._id);
    ok(res, { user });
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la récupération du profil');
  }
};

export const edit = async (req: any, res: any) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    ok(res, { user });
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la mise à jour du profil');
  }
};

export const forgot = async (req: any, res: any) => {
  try {
    const user: any = await User.findOne({ email: req.body.email });
    if (!user) return ok(res, {}, 'Si votre email existe, vous recevrez un lien de réinitialisation');

    const { raw, hash } = generateReset();
    user.resetToken = hash;
    user.resetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const url = `${process.env.FRONTEND_URL}/reset-password/${raw}`;
    const { text, html } = resetPassword(user.username || 'utilisateur', url);
    await send(user.email, 'Réinitialisation du mot de passe', text, html);

    ok(res, {}, 'Si votre email existe, vous recevrez un lien de réinitialisation');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de l\'envoi du mail de réinitialisation');
  }
};

export const resetPass = async (req: any, res: any) => {
  try {
    const hash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user: any = await User.findOne({
      resetToken: hash,
      resetExpires: { $gt: Date.now() }
    });
    if (!user) return error(res, 400, 'Token invalide ou expiré');

    user.password = await bcrypt.hash(req.body.password, 8);
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    ok(res, {}, 'Mot de passe réinitialisé avec succès');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la réinitialisation du mot de passe');
  }
};
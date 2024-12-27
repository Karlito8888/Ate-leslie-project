// backend/src/controllers/adminController.ts

import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { Message } from '../models/Message';
import { ok, error } from '../utils/responseHandler';
import { send } from '../utils/email';
import { AuthRequest } from '../types/express';

export const stats = async (_: Request, res: Response): Promise<void> => {
  try {
    const users = await User.countDocuments({ role: 'user' });
    const admins = await User.countDocuments({ role: 'admin' });
    ok(res, { stats: { users, admins } });
  } catch (e: any) {
    error(res, 500, e.message || 'Erreur lors de la récupération des statistiques');
  }
};

export const list = async (_: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    ok(res, { users });
  } catch (e: any) {
    error(res, 500, e.message || 'Erreur lors de la récupération des utilisateurs');
  }
};

export const delUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id) as IUser;
    if (!user) {
      error(res, 404, 'Utilisateur non trouvé');
      return;
    }
    if (user.role === 'admin') {
      error(res, 403, 'Impossible de supprimer un administrateur');
      return;
    }

    await user.deleteOne();
    ok(res, {}, 'Utilisateur supprimé avec succès');
  } catch (e: any) {
    error(res, 500, e.message || 'Erreur lors de la suppression de l\'utilisateur');
  }
};

export const getMessages = async (_: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find()
      .populate('assignedTo', 'username')
      .sort('-createdAt');
    ok(res, { messages });
  } catch (e: any) {
    error(res, 500, e.message || 'Erreur lors de la récupération des messages');
  }
};

export const assign = async (req: Request, res: Response): Promise<void> => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      error(res, 404, 'Message non trouvé');
      return;
    }

    const admin = await User.findById(req.body.admin) as IUser;
    if (!admin || admin.role !== 'admin') {
      error(res, 403, 'Administrateur invalide');
      return;
    }

    msg.assignedTo = admin._id;
    msg.status = 'assigned';
    await msg.save();
    ok(res, { message: msg }, 'Message assigné avec succès');
  } catch (e: any) {
    error(res, 500, e.message || 'Erreur lors de l\'assignation du message');
  }
};

export const status = async (req: Request, res: Response): Promise<void> => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      error(res, 404, 'Message non trouvé');
      return;
    }

    msg.status = req.body.status;
    await msg.save();
    ok(res, { message: msg }, 'Statut mis à jour avec succès');
  } catch (e: any) {
    error(res, 500, e.message || 'Erreur lors de la mise à jour du statut');
  }
};

export const reply = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      error(res, 404, 'Message non trouvé');
      return;
    }
    if (!msg.email) {
      error(res, 400, 'Email du destinataire manquant');
      return;
    }

    msg.replies.push({
      admin: req.user._id,
      content: req.body.content
    });
    
    // Mise à jour du statut si nécessaire
    if (msg.status === 'new' || msg.status === 'assigned') {
      msg.status = 'in_progress';
    }
    
    await msg.save();

    // Envoi d'un email à l'utilisateur
    const text = `Bonjour,\n\nNouvelle réponse à votre message:\n${req.body.content}`;
    await send(
      msg.email,
      'Réponse à votre message',
      text
    );

    ok(res, { message: msg }, 'Réponse envoyée avec succès');
  } catch (e: any) {
    error(res, 500, e.message || 'Erreur lors de l\'envoi de la réponse');
  }
}; 
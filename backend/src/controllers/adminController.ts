// backend/src/controllers/adminController.ts

import { User } from '../models/User';
import { Message } from '../models/Message';
import { ok, error } from '../utils/responseHandler';

export const stats = async (_: any, res: any) => {
  try {
    const users = await User.countDocuments({ role: 'user' });
    const admins = await User.countDocuments({ role: 'admin' });
    ok(res, { stats: { users, admins } });
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la récupération des statistiques');
  }
};

export const users = async (_: any, res: any) => {
  try {
    const users = await User.find().select('-password');
    ok(res, { users });
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la récupération des utilisateurs');
  }
};

export const delUser = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, 404, 'Utilisateur non trouvé');
    if (user.role === 'admin') return error(res, 403, 'Impossible de supprimer un administrateur');

    await user.deleteOne();
    ok(res, {}, 'Utilisateur supprimé avec succès');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la suppression de l\'utilisateur');
  }
};

export const msgs = async (_: any, res: any) => {
  try {
    const messages = await Message.find()
      .populate('assignedTo', 'username')
      .sort('-createdAt');
    ok(res, { messages });
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la récupération des messages');
  }
};

export const assign = async (req: any, res: any) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return error(res, 404, 'Message non trouvé');

    const admin = await User.findById(req.body.admin);
    if (!admin || admin.role !== 'admin') return error(res, 403, 'Administrateur invalide');

    msg.assignedTo = admin._id;
    msg.status = 'assigned';
    await msg.save();
    ok(res, { message: msg }, 'Message assigné avec succès');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de l\'assignation du message');
  }
};

export const status = async (req: any, res: any) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return error(res, 404, 'Message non trouvé');

    msg.status = req.body.status;
    await msg.save();
    ok(res, { message: msg }, 'Statut mis à jour avec succès');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la mise à jour du statut');
  }
}; 
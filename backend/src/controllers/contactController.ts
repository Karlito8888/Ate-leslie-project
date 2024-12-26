import { Contact } from '../models/Contact';
import { send } from '../utils/email';
import { ok, error, created } from '../utils/responseHandler';

export const add = async (req: any, res: any) => {
  try {
    const msg = await Contact.create(req.body);
    
    const text = `Bonjour ${req.body.name}, message bien reçu.`;
    await send(
      req.body.email,
      'Message reçu',
      text,
      `<p>${text}</p>`
    );

    created(res, { message: msg }, 'Message envoyé avec succès');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de l\'envoi du message');
  }
};

export const list = async (_: any, res: any) => {
  try {
    const messages = await Contact.find().sort('-createdAt');
    ok(res, { messages });
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la récupération des messages');
  }
};

export const edit = async (req: any, res: any) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!msg) return error(res, 404, 'Message non trouvé');
    ok(res, { message: msg }, 'Message mis à jour avec succès');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la mise à jour du message');
  }
}; 
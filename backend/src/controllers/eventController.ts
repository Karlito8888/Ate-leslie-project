import { Event } from '../models/Event';
import { ok, error, created } from '../utils/responseHandler';

export const add = async (req: any, res: any) => {
  try {
    const event = await Event.create({
      ...req.body,
      by: req.user._id
    });
    created(res, { event }, 'Événement créé avec succès');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la création de l\'événement');
  }
};

export const list = async (_: any, res: any) => {
  try {
    const events = await Event.find().populate('by', 'username');
    ok(res, { events });
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la récupération des événements');
  }
};

export const get = async (req: any, res: any) => {
  try {
    const event = await Event.findById(req.params.id).populate('by', 'username');
    if (!event) return error(res, 404, 'Événement non trouvé');
    ok(res, { event });
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la récupération de l\'événement');
  }
};

export const edit = async (req: any, res: any) => {
  try {
    const event: any = await Event.findById(req.params.id);
    if (!event) return error(res, 404, 'Événement non trouvé');
    if (event.by.toString() !== req.user._id) return error(res, 403, 'Vous n\'êtes pas l\'organisateur de cet événement');

    Object.assign(event, req.body);
    await event.save();
    ok(res, { event }, 'Événement mis à jour avec succès');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la mise à jour de l\'événement');
  }
};

export const del = async (req: any, res: any) => {
  try {
    const event: any = await Event.findById(req.params.id);
    if (!event) return error(res, 404, 'Événement non trouvé');
    if (event.by.toString() !== req.user._id) return error(res, 403, 'Vous n\'êtes pas l\'organisateur de cet événement');

    await event.deleteOne();
    ok(res, {}, 'Événement supprimé avec succès');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la suppression de l\'événement');
  }
};

export const join = async (req: any, res: any) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return error(res, 404, 'Événement non trouvé');
    if (event.users.includes(req.user._id)) return error(res, 400, 'Vous participez déjà à cet événement');
    
    event.users.push(req.user._id);
    await event.save();
    ok(res, { event }, 'Inscription à l\'événement réussie');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de l\'inscription à l\'événement');
  }
};

export const leave = async (req: any, res: any) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return error(res, 404, 'Événement non trouvé');
    
    const i = event.users.indexOf(req.user._id);
    if (i === -1) return error(res, 400, 'Vous ne participez pas à cet événement');
    
    event.users.splice(i, 1);
    await event.save();
    ok(res, { event }, 'Désinscription de l\'événement réussie');
  } catch (e: any) {
    error(res, 400, e.message || 'Erreur lors de la désinscription de l\'événement');
  }
};

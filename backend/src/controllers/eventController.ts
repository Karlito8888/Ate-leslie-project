import { Types } from 'mongoose';
import { Event, IEvent } from '../models/Event';
import { AuthRequest } from '../types/express';
import { Response } from 'express';

// Lister les événements
export const list = async (req: AuthRequest, res: Response) => {
  try {
    const query = buildQuery(req.query);
    const events = await Event.find(query).populate('by', 'username');
    res.json({ success: true, data: { events } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Créer un événement
export const create = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.create({
      ...req.body,
      by: new Types.ObjectId(req.user.id)
    });

    res.status(201).json({ success: true, data: { event } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Mettre à jour un événement
export const update = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, by: new Types.ObjectId(req.user.id) },
      req.body,
      { new: true }
    ).lean() as IEvent | null;

    if (!event) {
      res.status(404).json({ success: false, error: 'Événement non trouvé' });
      return;
    }

    res.json({ success: true, data: { event } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Supprimer un événement
export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      by: new Types.ObjectId(req.user.id)
    }).lean() as IEvent | null;

    if (!event) {
      res.status(404).json({ success: false, error: 'Événement non trouvé' });
      return;
    }

    res.json({ success: true, data: { event } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Fonction utilitaire pour construire la requête
const buildQuery = (params: any) => {
  const query: any = {};
  
  if (params.category) {
    query.category = params.category;
  }
  
  if (params.date) {
    const date = new Date(params.date);
    query.date = {
      $gte: date,
      $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
    };
  }
  
  if (params.search) {
    query.$or = [
      { title: new RegExp(params.search, 'i') },
      { desc: new RegExp(params.search, 'i') }
    ];
  }

  return query;
};

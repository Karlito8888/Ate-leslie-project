import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Event } from '../models/Event';
import { error, created } from '../utils/responseHandler';

export const add = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user?.id;

    // Vérifier si l'événement existe
    const event = await Event.findById(eventId);
    if (!event) {
      return error(res, 404, 'Événement non trouvé');
    }

    // Vérifier si l'utilisateur a déjà laissé une review
    const existingReview = await Review.findOne({ event: eventId, user: userId });
    if (existingReview) {
      return error(res, 400, 'Vous avez déjà laissé une review pour cet événement');
    }

    // Créer la review
    const review = await Review.create({
      event: eventId,
      user: userId,
      stars: req.body.stars,
      text: req.body.text
    });

    return created(res, { review }, 'Review créée avec succès');
  } catch (e: any) {
    return error(res, 500, e.message || 'Erreur lors de la création de la review');
  }
}; 
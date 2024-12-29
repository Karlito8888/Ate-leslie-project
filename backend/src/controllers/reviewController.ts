import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Review } from '../models/Review';

interface AuthRequest extends Request {
  user: {
    _id: Types.ObjectId;
    id: string;
    role: 'user' | 'admin';
    username: string;
    email: string;
  };
}

// Lister les reviews d'un événement
export const list = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des reviews" });
  }
};

// Ajouter une review
export const add = async (req: AuthRequest, res: Response) => {
  try {
    const review = new Review({
      user: req.user.id,
      event: req.params.eventId,
      stars: req.body.stars,
      text: req.body.text
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de la review" });
  }
};

// Modifier une review
export const update = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findOne({ 
      _id: req.params.reviewId,
      user: req.user.id // Vérifier que l'utilisateur est l'auteur
    });

    if (!review) {
      return res.status(404).json({ message: "Review non trouvée ou non autorisée" });
    }

    review.stars = req.body.stars || review.stars;
    review.text = req.body.text || review.text;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification de la review" });
  }
};

// Supprimer une review
export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      user: req.user.id // Vérifier que l'utilisateur est l'auteur
    });

    if (!review) {
      return res.status(404).json({ message: "Review non trouvée ou non autorisée" });
    }

    res.json({ message: "Review supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la review" });
  }
}; 
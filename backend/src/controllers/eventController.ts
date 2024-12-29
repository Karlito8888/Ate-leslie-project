import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Event } from '../models/Event';
import { User } from '../models/User';

// Recherche avancée
export const search = async (req: Request, res: Response) => {
  try {
    const { query, category, startDate, endDate, location } = req.query;
    
    const filter: any = {};
    
    if (query) {
      filter.$or = [
        { title: new RegExp(query as string, 'i') },
        { description: new RegExp(query as string, 'i') }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }
    
    if (location) {
      filter.location = new RegExp(location as string, 'i');
    }
    
    const events = await Event.find(filter)
      .sort({ date: 1 })
      .populate('creator', 'username');
      
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la recherche d'événements" });
  }
};

// Ajouter aux favoris
export const addBookmark = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    if (user.bookmarks.includes(event._id)) {
      return res.status(400).json({ message: "Événement déjà dans les favoris" });
    }

    user.bookmarks.push(event._id);
    await user.save();

    res.json({ message: "Événement ajouté aux favoris" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout aux favoris" });
  }
};

// Retirer des favoris
export const removeBookmark = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    const index = user.bookmarks.indexOf(event._id);
    if (index === -1) {
      return res.status(400).json({ message: "Événement non trouvé dans les favoris" });
    }

    user.bookmarks.splice(index, 1);
    await user.save();

    res.json({ message: "Événement retiré des favoris" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du retrait des favoris" });
  }
};

// Lister tous les événements
export const getAll = async (req: Request, res: Response) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .populate('creator', 'username');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des événements" });
  }
};

// Récupérer un événement
export const getOne = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'username');
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'événement" });
  }
};

// Créer un événement
export const create = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const event = new Event({
      ...req.body,
      creator: req.user.id
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'événement" });
  }
};

// Mettre à jour un événement
export const update = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const event = await Event.findOne({
      _id: req.params.id,
      creator: req.user.id
    });

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé ou non autorisé" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'événement" });
  }
};

// Supprimer un événement
export const remove = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      creator: req.user.id
    });

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé ou non autorisé" });
    }

    res.json({ message: "Événement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'événement" });
  }
};

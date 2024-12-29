import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Message } from '../models/Message';

interface AuthRequest extends Request {
  user: {
    _id: Types.ObjectId;
    id: string;
    role: 'user' | 'admin';
    username: string;
    email: string;
  };
}

// Lister les messages
export const list = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const pinned = req.query.pinned === 'true';

    const query: any = {};
    if (pinned) query.pinned = true;

    const messages = await Message.find(query)
      .sort({ pinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'username');

    const total = await Message.countDocuments(query);

    res.json({
      messages,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages" });
  }
};

// Créer un message
export const create = async (req: AuthRequest, res: Response) => {
  try {
    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      type: req.body.type,
      author: req.user._id,
      pinned: req.body.pinned || false
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du message" });
  }
};

// Récupérer un message
export const getOne = async (req: Request, res: Response) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('author', 'username');

    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du message" });
  }
};

// Mettre à jour un message
export const update = async (req: Request, res: Response) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        pinned: req.body.pinned
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du message" });
  }
};

// Supprimer un message
export const remove = async (req: Request, res: Response) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    res.json({ message: "Message supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du message" });
  }
};

// Épingler/désépingler un message
export const togglePin = async (req: Request, res: Response) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    await Message.updateOne(
      { _id: message._id },
      { $set: { pinned: !(message.toObject().pinned || false) } }
    );

    res.json({ message: "Statut d'épinglage modifié avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification du message" });
  }
}; 
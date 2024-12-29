import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user: {
    _id: Types.ObjectId;
    id: string;
    role: 'user' | 'admin';
    username: string;
    email: string;
  };
}

// Lister les utilisateurs
export const list = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;
    const status = req.query.status as string;

    const query: any = {};
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

// Récupérer un utilisateur
export const getOne = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
  }
};

// Changer le rôle
export const updateRole = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Empêcher de modifier son propre rôle
    if (user.id === req.user.id) {
      return res.status(403).json({ message: "Vous ne pouvez pas modifier votre propre rôle" });
    }

    user.role = req.body.role;
    await user.save();

    res.json({ message: "Rôle mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du rôle" });
  }
};

// Changer le statut (bloquer/débloquer)
export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Empêcher de se bloquer soi-même
    if (user.id === req.user.id) {
      return res.status(403).json({ message: "Vous ne pouvez pas modifier votre propre statut" });
    }

    const { status } = req.body;
    await User.updateOne({ _id: user._id }, { status });

    res.json({ message: "Statut mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
  }
};

// Supprimer un utilisateur
export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Empêcher de se supprimer soi-même
    if (user.id === req.user.id) {
      return res.status(403).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
    }

    await User.deleteOne({ _id: user._id });

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
}; 
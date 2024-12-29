import { Request, Response } from 'express';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Review } from '../models/Review';

// Voir son profil
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Modifier son profil
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Changer son mot de passe
export const changePassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentPassword, newPassword } = req.body;
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Voir ses événements créés
export const getMyEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ author: req.user?.id })
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Voir ses reviews
export const getMyReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ author: req.user?.id })
      .sort({ createdAt: -1 })
      .populate('event', 'title');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Voir ses événements favoris
export const getMyBookmarks = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id)
      .populate('bookmarks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 
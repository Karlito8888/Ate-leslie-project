import { Request, Response } from 'express';
import { AdminMessage } from '../models/AdminMessage';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';

export const inbox = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const messages = await AdminMessage.find({ to: userId })
    .populate('from', 'username email')
    .populate('to', 'username email')
    .sort({ createdAt: -1 });

  res.json({
    status: 'success',
    data: {
      messages
    }
  });
};

export const sent = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const messages = await AdminMessage.find({ from: userId })
    .populate('from', 'username email')
    .populate('to', 'username email')
    .sort({ createdAt: -1 });

  res.json({
    status: 'success',
    data: {
      messages
    }
  });
};

export const send = async (req: Request, res: Response) => {
  const { to, subject, content } = req.body;
  const fromId = req.user?._id;

  // Vérifier que le destinataire est un admin
  const recipient = await User.findById(to);
  if (!recipient || recipient.role !== 'admin') {
    throw new ApiError('Recipient must be an admin', 403);
  }

  const message = await AdminMessage.create({
    from: fromId,
    to,
    subject,
    content
  });

  await message.populate('from', 'username email');
  await message.populate('to', 'username email');

  res.json({
    status: 'success',
    data: {
      message
    }
  });
};

export const markAsRead = async (req: Request, res: Response) => {
  const messageId = req.params.id;
  const userId = req.user?._id;

  const message = await AdminMessage.findById(messageId);
  if (!message) {
    throw new ApiError('Message not found', 404);
  }

  // Vérifier que l'utilisateur est le destinataire
  if (message.to.toString() !== userId?.toString()) {
    throw new ApiError('Not authorized to mark this message as read', 403);
  }

  message.isRead = true;
  await message.save();

  await message.populate('from', 'username email');
  await message.populate('to', 'username email');

  res.json({
    status: 'success',
    data: {
      message
    }
  });
}; 
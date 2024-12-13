import { Request, Response, NextFunction } from 'express';
import { Contact } from '../models/Contact';
import { HTTP_CODES, RESPONSE_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';
import { createApiError } from '../utils/modelHelpers';
import { sendEmail } from '../utils/email';

// Create a new contact message
export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contact = await Contact.create(req.body);

    // Send confirmation email to user
    await sendEmail({
      to: req.body.email,
      subject: 'Message Received - Ate Leslie Events',
      text: `Hello ${req.body.name},\n\nWe have received your message. Our team will get back to you as soon as possible.\n\nBest regards,\nThe Ate Leslie Team`,
      html: `
        <h2>Message Received</h2>
        <p>Hello ${req.body.name},</p>
        <p>We have received your message. Our team will get back to you as soon as possible.</p>
        <p>Best regards,<br>The Ate Leslie Team</p>
      `
    });

    res.status(HTTP_CODES.CREATED).json({
      status: RESPONSE_STATUS.SUCCESS,
      message: SUCCESS_MESSAGES.CONTACT_CREATED,
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// Get all messages (admin only)
export const getAllContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(HTTP_CODES.OK).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: { contacts }
    });
  } catch (error) {
    next(error);
  }
};

// Update message status (admin only)
export const updateContactStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      throw createApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.CONTACT_NOT_FOUND);
    }

    res.status(HTTP_CODES.OK).json({
      status: RESPONSE_STATUS.SUCCESS,
      message: SUCCESS_MESSAGES.CONTACT_UPDATED,
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
}; 
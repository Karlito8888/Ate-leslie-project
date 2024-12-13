import { Request, Response, NextFunction } from "express";
import { Event, IEvent } from "../models/Event";
import { Review } from "../models/Review";
import {
  HTTP_CODES,
  ERROR_MESSAGES,
  RESPONSE_STATUS,
  SUCCESS_MESSAGES,
} from "../utils/constants";
import { createApiError, findEvent } from "../utils/modelHelpers";
import { processImage, processImages } from "../utils/uploadHandler";
import { Types } from "mongoose";
import path from "path";
import fs from "fs";
import { UserRole } from '../models/User';

// Types
interface RequestWithUser extends Omit<Request, 'user'> {
  user: {
    id: string;
    role: UserRole;
  };
}

// Contrôleurs
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await Event.find().populate("organizer", "username");

    res.status(HTTP_CODES.OK).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "username")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "username" },
      });

    if (!event) {
      throw createApiError(
        HTTP_CODES.NOT_FOUND,
        ERROR_MESSAGES.EVENT_NOT_FOUND
      );
    }

    res.status(HTTP_CODES.OK).json({
      status: RESPONSE_STATUS.SUCCESS,
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventData = {
      ...req.body,
      organizer: new Types.ObjectId(req.user.id)
    };

    if (req.files && Array.isArray(req.files)) {
      eventData.images = await processImages(req.files);
    }

    const event = await Event.create(eventData);

    res.status(HTTP_CODES.CREATED).json({
      status: RESPONSE_STATUS.SUCCESS,
      message: SUCCESS_MESSAGES.EVENT_CREATED,
      data: { event }
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      throw createApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    if (event.organizer.toString() !== req.user.id) {
      throw createApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.NOT_AUTHORIZED);
    }

    const updateData = { ...req.body };

    if (req.files && Array.isArray(req.files)) {
      // Delete old images if they exist
      if (event.images && event.images.length > 0) {
        for (const image of event.images) {
          const imagePath = path.join(__dirname, '../../uploads', image);
          try {
            await fs.promises.unlink(imagePath);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }
      }
      updateData.images = await processImages(req.files);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(HTTP_CODES.OK).json({
      status: RESPONSE_STATUS.SUCCESS,
      message: SUCCESS_MESSAGES.EVENT_UPDATED,
      data: { event: updatedEvent }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      throw createApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    if (event.organizer.toString() !== req.user.id) {
      throw createApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.NOT_AUTHORIZED);
    }

    // Delete associated images
    if (event.images && event.images.length > 0) {
      for (const image of event.images) {
        const imagePath = path.join(__dirname, '../../uploads', image);
        try {
          await fs.promises.unlink(imagePath);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }

    await event.deleteOne();

    res.status(HTTP_CODES.OK).json({
      status: RESPONSE_STATUS.SUCCESS,
      message: SUCCESS_MESSAGES.EVENT_DELETED
    });
  } catch (error) {
    next(error);
  }
};

export const participateInEvent = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await findEvent(req.params.id);
    const userId = new Types.ObjectId(req.user.id);

    if (event.participants.includes(userId)) {
      throw createApiError(
        HTTP_CODES.BAD_REQUEST,
        ERROR_MESSAGES.ALREADY_PARTICIPATING
      );
    }

    if (
      event.maxParticipants &&
      event.participants.length >= event.maxParticipants
    ) {
      throw createApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.EVENT_FULL);
    }

    event.participants.push(userId);
    await event.save();

    res.status(HTTP_CODES.OK).json({
      status: RESPONSE_STATUS.SUCCESS,
      message: SUCCESS_MESSAGES.EVENT_PARTICIPATION,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelParticipation = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await findEvent(req.params.id);
    const userId = new Types.ObjectId(req.user.id);

    const participantIndex = event.participants.findIndex((id) =>
      id.equals(userId)
    );
    if (participantIndex === -1) {
      throw createApiError(
        HTTP_CODES.BAD_REQUEST,
        ERROR_MESSAGES.NOT_PARTICIPATING
      );
    }

    event.participants.splice(participantIndex, 1);
    await event.save();

    res.status(HTTP_CODES.OK).json({
      status: RESPONSE_STATUS.SUCCESS,
      message: SUCCESS_MESSAGES.EVENT_PARTICIPATION_CANCELLED,
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await findEvent(req.params.id);
    const userId = new Types.ObjectId(req.user.id);

    if (!event.participants.some(id => id.equals(userId))) {
      throw createApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.MUST_PARTICIPATE);
    }

    const existingReview = await Review.findOne({
      event: new Types.ObjectId(req.params.id),
      user: userId
    });

    if (existingReview) {
      throw createApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.ALREADY_REVIEWED);
    }

    const review = await Review.create({
      event: new Types.ObjectId(req.params.id),
      user: userId,
      rating: req.body.rating,
      comment: req.body.comment
    });

    event.reviews.push(review._id as Types.ObjectId);
    await event.save();

    res.status(HTTP_CODES.CREATED).json({
      status: RESPONSE_STATUS.SUCCESS,
      message: SUCCESS_MESSAGES.REVIEW_CREATED,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

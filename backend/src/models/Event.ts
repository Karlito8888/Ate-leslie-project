// backend/src/models/Event.ts

import mongoose, { Document, Schema, Types } from 'mongoose';
import path from 'path';
import fs from 'fs';

export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  maxParticipants?: number;
  price?: number;
  category: string;
  images: string[];
  organizer: Types.ObjectId;
  participants: Types.ObjectId[];
  reviews: Types.ObjectId[];
  ratingsQuantity: number;
  ratingsAverage: number;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    maxParticipants: {
      type: Number,
      min: 1
    },
    price: {
      type: Number,
      min: 0
    },
    category: {
      type: String,
      required: false,
      enum: ['concert', 'festival', 'theater', 'sport', 'other']
    },
    images: [{
      type: String
    }],
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }],
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (val: number) => Math.round(val * 10) / 10
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ organizer: 1 });

// Virtuals
eventSchema.virtual('isUpcoming').get(function(this: IEvent) {
  return new Date() < this.startDate;
});

eventSchema.virtual('isOngoing').get(function(this: IEvent) {
  const now = new Date();
  return now >= this.startDate && (!this.endDate || now <= this.endDate);
});

eventSchema.virtual('isPast').get(function(this: IEvent) {
  return this.endDate ? new Date() > this.endDate : new Date() > this.startDate;
});

eventSchema.virtual('isFull').get(function(this: IEvent) {
  return this.maxParticipants ? this.participants.length >= this.maxParticipants : false;
});

// Middleware pre-deleteOne to delete associated images
eventSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  if (this.images && this.images.length > 0) {
    for (const image of this.images) {
      const imagePath = path.join(__dirname, '../../uploads', image);
      try {
        await fs.promises.unlink(imagePath);
      } catch (error) {
        console.error("Error while deleting image:", error);
      }
    }
  }
  next();
});

export const Event = mongoose.model<IEvent>('Event', eventSchema); 
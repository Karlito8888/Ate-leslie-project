// backend/src/models/Event.ts

import { Schema, model, Types, Document } from 'mongoose';

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  desc: string;
  date: Date;
  category: 'workshop' | 'conference' | 'meetup' | 'other';
  by: Types.ObjectId;
  status: 'draft' | 'published' | 'cancelled';
  rating?: number;
}

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['workshop', 'conference', 'meetup', 'other'],
    default: 'other'
  },
  by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled'],
    default: 'draft'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, {
  timestamps: true
});

// Indexation pour la recherche
eventSchema.index({ title: 'text', desc: 'text' });
eventSchema.index({ category: 1, date: 1 });

export const Event = model<IEvent>('Event', eventSchema); 
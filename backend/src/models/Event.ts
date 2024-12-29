// backend/src/models/Event.ts

import mongoose from 'mongoose';

// Types pour TypeScript
export type Status = 'draft' | 'published' | 'cancelled';

export type EventDocument = mongoose.Document & {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: mongoose.Types.ObjectId;
  status: Status;
  rating?: number;
};

// Schéma Event
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'published', 'cancelled'], default: 'draft' },
  rating: { type: Number, min: 0, max: 5, default: 0 }
}, { timestamps: true });

// Export du modèle
export const Event = mongoose.model<EventDocument>('Event', eventSchema); 
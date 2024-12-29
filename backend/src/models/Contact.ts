import { Schema, model, Document } from 'mongoose';

export type ContactStatus = 'unread' | 'read' | 'archived';

export interface ContactDocument extends Document {
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
}

const contactSchema = new Schema<ContactDocument>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  }
}, {
  timestamps: true
});

export const Contact = model<ContactDocument>('Contact', contactSchema); 
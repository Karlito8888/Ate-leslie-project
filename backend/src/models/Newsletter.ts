import { Schema, model, Document } from 'mongoose';

export interface NewsletterDocument extends Document {
  email: string;
  createdAt: Date;
}

const newsletterSchema = new Schema<NewsletterDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true
});

export const Newsletter = model<NewsletterDocument>('Newsletter', newsletterSchema); 
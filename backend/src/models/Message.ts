import { Schema, model, Document } from 'mongoose';

export interface MessageDocument extends Document {
  title: string;
  content: string;
  type: string;
  author: Schema.Types.ObjectId;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<MessageDocument>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'error'],
    default: 'info'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Message = model<MessageDocument>('Message', messageSchema); 
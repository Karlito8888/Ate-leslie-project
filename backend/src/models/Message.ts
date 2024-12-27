import { Schema, model } from 'mongoose';

const replySchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const schema = new Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'new' },
  replies: [replySchema]
}, { 
  timestamps: true 
});

export const Message = model('Message', schema); 
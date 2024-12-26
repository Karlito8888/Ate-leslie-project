import { Schema, model } from 'mongoose';

const schema = new Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  status: { type: String, default: 'unread' }
}, { 
  timestamps: true 
});

export const Contact = model('Contact', schema); 
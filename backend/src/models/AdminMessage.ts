import { Schema, model } from 'mongoose';

const schema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

export const AdminMessage = model('AdminMessage', schema); 
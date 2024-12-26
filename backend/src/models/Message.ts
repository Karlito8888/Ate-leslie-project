import { Schema, model } from 'mongoose';

const schema = new Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'new' }
}, { 
  timestamps: true 
});

export const Message = model('Message', schema); 
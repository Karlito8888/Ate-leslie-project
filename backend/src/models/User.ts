// backend/src/models/User.ts

import { Schema, model } from 'mongoose';

const schema = new Schema({
  username: String,
  email: String,
  password: String,
  role: String
});

export const User = model('User', schema);

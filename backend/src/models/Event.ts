// backend/src/models/Event.ts

import { Schema, model } from 'mongoose';

const schema = new Schema({
  title: String,
  desc: String,
  date: Date,
  loc: String,
  by: String,
  users: [String],
  img: [String]
});

export const Event = model('Event', schema); 
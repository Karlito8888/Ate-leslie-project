// backend/src/models/Review.ts

import { Schema, model } from 'mongoose';

const schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  stars: { type: Number, min: 1, max: 5 },
  text: String
}, { 
  timestamps: true 
});

schema.index({ event: 1, user: 1 }, { unique: true });

schema.post('save', async function() {
  const stats = await model('Review').aggregate([
    { $match: { event: this.event } },
    { $group: { _id: '$event', avg: { $avg: '$stars' } } }
  ]);
  
  await model('Event').updateOne(
    { _id: this.event },
    { $set: { rating: stats[0]?.avg || 0 } }
  );
});

export const Review = model('Review', schema); 
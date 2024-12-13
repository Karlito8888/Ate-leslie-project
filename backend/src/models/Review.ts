// backend/src/models/Review.ts

import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
  event: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewModel extends mongoose.Model<IReview> {
  calculateAverageRating(eventId: Types.ObjectId): Promise<void>;
}

const reviewSchema = new Schema<IReview, ReviewModel>({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index unique pour empêcher les doublons
reviewSchema.index({ event: 1, user: 1 }, { unique: true });

// Calcul de la moyenne des notes
reviewSchema.statics.calculateAverageRating = async function(eventId: Types.ObjectId) {
  const stats = await this.aggregate([
    {
      $match: { event: eventId }
    },
    {
      $group: {
        _id: '$event',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Event').findByIdAndUpdate(eventId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10
    });
  } else {
    await mongoose.model('Event').findByIdAndUpdate(eventId, {
      ratingsQuantity: 0,
      ratingsAverage: 0
    });
  }
};

// Hooks pour mettre à jour les statistiques
reviewSchema.post('save', async function() {
  await (this.constructor as ReviewModel).calculateAverageRating(this.event);
});

reviewSchema.pre('deleteOne', { document: true, query: false }, async function() {
  await (this.constructor as ReviewModel).calculateAverageRating(this.event);
});

export const Review = mongoose.model<IReview, ReviewModel>('Review', reviewSchema); 
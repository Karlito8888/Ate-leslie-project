// backend/src/models/User.ts

import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Types pour TypeScript
export type Role = 'user' | 'admin';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  role: Role;
  fullName: string;
  bookmarks: Schema.Types.ObjectId[];
  newsletterSubscribed: boolean;
  resetToken?: string;
  resetExpires?: Date;
  comparePassword(password: string): Promise<boolean>;
}

// Schéma User
const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  fullName: { type: String, required: true },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  newsletterSubscribed: { type: Boolean, default: true },
  resetToken: { type: String },
  resetExpires: { type: Date }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

// Export du modèle
export const User = model<UserDocument>('User', userSchema);

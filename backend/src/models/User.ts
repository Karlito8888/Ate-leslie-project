// backend/src/models/User.ts

import mongoose, { Document, Types } from "mongoose";
import { hashPassword } from "../utils/auth";

export type UserRole = "user" | "admin";

interface Address {
  unit?: string;
  buildingName?: string;
  streetNumber: string;
  streetName: string;
  poBox?: string;
  district: string;
  city: string;
  emirate: string;
}

interface ValidatorProps {
  value: string;
}

const addressSchema = new mongoose.Schema<Address>({
  unit: { type: String },
  buildingName: { type: String },
  streetNumber: { type: String, required: true },
  streetName: { type: String, required: true },
  poBox: { type: String },
  district: { type: String, required: true },
  city: { type: String, required: true },
  emirate: { type: String, required: true }
}, { _id: false });

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  landlineNumber?: string;
  mobileNumber?: string;
  birthDate?: Date;
  address?: Address;
  newsletterSubscribed: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    landlineNumber: {
      type: String,
      sparse: true,
      validate: {
        validator: function(v: string) {
          return /^\+971 [2-9] [2-8][0-9]{6}$/.test(v);
        },
        message: (props: ValidatorProps) => `${props.value} is not a valid UAE landline number!`
      }
    },
    mobileNumber: {
      type: String,
      sparse: true,
      validate: {
        validator: function(v: string) {
          return /^\+971 5[024568] [0-9]{3} [0-9]{4}$/.test(v);
        },
        message: (props: ValidatorProps) => `${props.value} is not a valid UAE mobile number!`
      }
    },
    birthDate: {
      type: Date
    },
    address: {
      type: addressSchema
    },
    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

export const User = mongoose.model<IUser>("User", userSchema);

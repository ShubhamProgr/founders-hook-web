import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  
  onboardingAnswers: Map<string, any>; 
  
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    avatarUrl: {
      type: String,
      default: "https://picsum.photos/seed/avatar/200/200",
    },
    
    // Dynamic answers map
    onboardingAnswers: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);
export default User;
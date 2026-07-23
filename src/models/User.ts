import mongoose, { Schema, models, model } from "mongoose";

export const PROFESSIONAL_STATUSES = [
  "College Student",
  "Working Professional",
  "Founder",
  "Freelancer",
] as const;

export const TECH_FIELDS = [
  "AI / Machine Learning",
  "Web Development",
  "Mobile Development",
  "Blockchain / Web3",
  "Cybersecurity",
  "Cloud / DevOps",
  "Data Science",
  "Product Design",
  "Fintech",
  "HealthTech",
  "Climate Tech",
  "Marketing & Growth",
] as const;

export const EXPERTISE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

export const LOOKING_FOR_OPTIONS = [
  "Looking for a co-founder",
  "Looking for an internship",
  "Hiring interns for my startup",
  "Just exploring the community",
] as const;

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  bio: string;
  college?: string;
  professionalStatus?: (typeof PROFESSIONAL_STATUSES)[number];
  techFields?: string[];
  expertiseLevel?: (typeof EXPERTISE_LEVELS)[number];
  lookingFor?: (typeof LOOKING_FOR_OPTIONS)[number];
  onboardingComplete: boolean;
  createdAt: Date;
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
    bio: { type: String, default: "" },
    college: { type: String, default: "" },
    professionalStatus: { type: String, enum: PROFESSIONAL_STATUSES },
    techFields: [{ type: String, enum: TECH_FIELDS }],
    expertiseLevel: { type: String, enum: EXPERTISE_LEVELS },
    lookingFor: { type: String, enum: LOOKING_FOR_OPTIONS },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);

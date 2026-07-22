import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },

    // Onboarding profile — filled in right after signup/login
    onboardingComplete: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["founder", "student", "both"],
      default: null,
    },
    field: { type: String, default: null }, // primary tech field
    experience: { type: String, default: null }, // experience level
    skills: { type: [String], default: [] }, // multi-select expertise
    lookingFor: { type: [String], default: [] }, // goals on the platform
    availability: { type: String, default: null },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);

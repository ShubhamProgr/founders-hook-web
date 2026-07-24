import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  key: string;         // e.g., "primaryGoal"
  title: string;       // e.g., "What is your primary goal?"
  subtitle?: string;
  type: "single-choice" | "multi-choice" | "text";
  options?: string[];  // Only used for choice types
  order: number;       // To sort questions correctly
  isRequired: boolean;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    type: { type: String, enum: ["single-choice", "multi-choice", "text"], required: true },
    options: [{ type: String }],
    order: { type: Number, required: true },
    isRequired: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Question = mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);
export default Question;
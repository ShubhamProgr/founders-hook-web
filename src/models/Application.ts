import mongoose, { Schema, models, model } from "mongoose";

export interface IApplication {
  _id: mongoose.Types.ObjectId;
  startup: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  message: string;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    startup: { type: Schema.Types.ObjectId, ref: "Startup", required: true },
    roleId: { type: Schema.Types.ObjectId, required: true },
    applicant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

ApplicationSchema.index({ startup: 1, roleId: 1, applicant: 1 }, { unique: true });

export default models.Application ||
  model<IApplication>("Application", ApplicationSchema);

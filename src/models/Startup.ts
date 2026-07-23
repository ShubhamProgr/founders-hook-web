import mongoose, { Schema, models, model } from "mongoose";

export interface IOpenRole {
  title: string;
  type: "Internship" | "Full-time" | "Part-time";
  description: string;
}

export interface IStartup {
  _id: mongoose.Types.ObjectId;
  name: string;
  tagline: string;
  description: string;
  category: string;
  icon: string;
  coverImage: string;
  founder: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  openRoles: IOpenRole[];
  featured: boolean;
  createdAt: Date;
}

const OpenRoleSchema = new Schema<IOpenRole>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["Internship", "Full-time", "Part-time"],
      default: "Internship",
    },
    description: { type: String, default: "" },
  },
  { _id: true }
);

const StartupSchema = new Schema<IStartup>(
  {
    name: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, required: true },
    icon: { type: String, default: "🚀" },
    coverImage: {
      type: String,
      default: "https://picsum.photos/seed/startup/800/500",
    },
    founder: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    openRoles: [OpenRoleSchema],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Startup || model<IStartup>("Startup", StartupSchema);

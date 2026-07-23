import mongoose, { Schema, models, model } from "mongoose";

export interface IPost {
  _id: mongoose.Types.ObjectId;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  author?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" },
    authorName: { type: String, required: true },
    authorAvatar: {
      type: String,
      default: "https://picsum.photos/seed/author/100/100",
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default models.Post || model<IPost>("Post", PostSchema);

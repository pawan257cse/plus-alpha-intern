import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  views: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: String,
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    tags: [String],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1, isPublished: 1 });

export const Blog = mongoose.model<IBlog>("Blog", blogSchema);

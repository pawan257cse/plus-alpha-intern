import mongoose, { Document, Schema } from "mongoose";

export interface IComment {
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface ICommunityPost extends Document {
  author: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  comments: IComment[];
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const communityPostSchema = new Schema<ICommunityPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ isTrending: 1 });

export const CommunityPost = mongoose.model<ICommunityPost>(
  "CommunityPost",
  communityPostSchema
);

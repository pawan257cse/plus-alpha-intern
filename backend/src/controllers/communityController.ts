import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { CommunityPost } from "../models/CommunityPost.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getPosts = async (
  _req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const posts = await CommunityPost.find()
      .populate("author", "name avatar profilePhoto role")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 })
      .limit(50);
    return sendSuccess(res, posts);
  } catch {
    return sendError(res, "Failed to fetch posts", 500);
  }
};

export const createPost = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const { title, content, tags } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return sendError(res, "Title and content required", 400);
    }
    const post = await CommunityPost.create({
      author: req.user._id,
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : [],
    });
    const populated = await post.populate("author", "name avatar profilePhoto");
    return sendSuccess(res, populated, "Post created", 201);
  } catch {
    return sendError(res, "Failed to create post", 500);
  }
};

export const addComment = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const { content } = req.body;
    if (!content?.trim()) return sendError(res, "Comment required", 400);
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return sendError(res, "Post not found", 404);
    post.comments.push({
      user: req.user._id,
      content: content.trim(),
      createdAt: new Date(),
    });
    await post.save();
    const populated = await CommunityPost.findById(post._id).populate(
      "author",
      "name avatar profilePhoto"
    );
    return sendSuccess(res, populated, "Comment added");
  } catch {
    return sendError(res, "Failed to add comment", 500);
  }
};

import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Blog } from "../models/Blog.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getPublishedBlogs = async (
  _req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(20);
    return sendSuccess(res, blogs);
  } catch {
    return sendError(res, "Failed to fetch blogs", 500);
  }
};

export const adminListBlogs = async (
  _req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    return sendSuccess(res, blogs);
  } catch {
    return sendError(res, "Failed to fetch blogs", 500);
  }
};

export const createBlog = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const { title, excerpt, content, category, tags, coverImage, isPublished } =
      req.body;
    if (!title?.trim() || !excerpt?.trim() || !content?.trim()) {
      return sendError(res, "Title, excerpt, and content required", 400);
    }
    let slug = slugify(title);
    const existing = await Blog.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;
    const blog = await Blog.create({
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category || "General",
      tags: tags || [],
      coverImage,
      isPublished: !!isPublished,
      author: req.user._id,
    });
    return sendSuccess(res, blog, "Blog created", 201);
  } catch {
    return sendError(res, "Failed to create blog", 500);
  }
};

export const updateBlog = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!blog) return sendError(res, "Blog not found", 404);
    return sendSuccess(res, blog);
  } catch {
    return sendError(res, "Failed to update blog", 500);
  }
};

export const deleteBlog = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return sendError(res, "Blog not found", 404);
    return sendSuccess(res, null, "Blog deleted");
  } catch {
    return sendError(res, "Failed to delete blog", 500);
  }
};

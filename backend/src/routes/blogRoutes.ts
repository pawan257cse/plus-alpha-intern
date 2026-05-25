import { Router } from "express";
import {
  getPublishedBlogs,
  adminListBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", getPublishedBlogs);
router.get("/admin/all", protect, authorize("admin"), adminListBlogs);
router.post("/admin", protect, authorize("admin"), createBlog);
router.put("/admin/:id", protect, authorize("admin"), updateBlog);
router.delete("/admin/:id", protect, authorize("admin"), deleteBlog);

export default router;

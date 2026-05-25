import { Router } from "express";
import { getPosts, createPost, addComment } from "../controllers/communityController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getPosts);
router.post("/", protect, createPost);
router.post("/:id/comments", protect, addComment);

export default router;

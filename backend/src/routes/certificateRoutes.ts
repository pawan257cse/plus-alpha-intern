import { Router } from "express";
import {
  getMyCertificates,
  verifyCertificate,
} from "../controllers/certificateController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/verify/:id", verifyCertificate);
router.get("/me", protect, getMyCertificates);

export default router;

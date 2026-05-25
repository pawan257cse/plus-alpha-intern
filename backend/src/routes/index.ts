import { Router, type Request, type Response } from "express";
import authRoutes from "./authRoutes.js";
import internshipRoutes from "./internshipRoutes.js";
import courseRoutes from "./courseRoutes.js";
import aiRoutes from "./aiRoutes.js";
import certificateRoutes from "./certificateRoutes.js";
import adminRoutes from "./adminRoutes.js";
import userRoutes from "./userRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import companyRoutes from "./companyRoutes.js";
import communityRoutes from "./communityRoutes.js";
import blogRoutes from "./blogRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/internships", internshipRoutes);
router.use("/courses", courseRoutes);
router.use("/ai", aiRoutes);
router.use("/certificates", certificateRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/payments", paymentRoutes);
router.use("/company", companyRoutes);
router.use("/community", communityRoutes);
router.use("/blogs", blogRoutes);

router.get("/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Plus Alpha Intern API is running" });
});

export default router;

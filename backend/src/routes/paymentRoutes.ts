import { Router } from "express";
import {
  getPublicFeeSettings,
  getMyPaymentStatus,
  createPaymentOrder,
  confirmRazorpayPayment,
  submitManualPaymentProof,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";
import { uploadPaymentProof } from "../middleware/uploadPaymentProof.js";

const router = Router();

router.get("/settings", getPublicFeeSettings);
router.get("/my-status", protect, getMyPaymentStatus);
router.post("/create-order", protect, createPaymentOrder);
router.post("/confirm", protect, confirmRazorpayPayment);
router.post(
  "/manual-proof",
  protect,
  uploadPaymentProof.single("proof"),
  submitManualPaymentProof
);

export default router;

import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  verifyOTP,
  googleLogin,
  resendOTP,
  getMe,
  forgotPassword,
  resetPassword,
  registerValidation,
  refreshAccessToken,
  logout,
  getAuthConfig,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: "Too many auth attempts. Try again later." },
});

router.use(authLimiter);

router.get("/config", getAuthConfig);
router.post("/register", validate(registerValidation), register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;

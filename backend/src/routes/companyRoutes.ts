import { Router } from "express";
import {
  registerCompany,
  getCompanyDashboard,
  companyRegisterValidation,
} from "../controllers/companyController.js";
import { protect, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/register", validate(companyRegisterValidation), registerCompany);
router.get("/dashboard", protect, authorize("company"), getCompanyDashboard);

export default router;

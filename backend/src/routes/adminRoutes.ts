import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  verifyUser,
  approveStudent,
  rejectStudent,
  verifyCompany,
  updateUser,
  setUserStatus,
  deleteUser,
  getAdminCertificates,
  issueCertificate,
  broadcastNotification,
  getAdminApplications,
  getAdminInternships,
  createAdminInternship,
  updateAdminInternship,
  deleteAdminInternship,
} from "../controllers/adminController.js";
import {
  adminListBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { getAdminTasks, reviewTask } from "../controllers/taskController.js";
import {
  listDomainTasksAdmin,
  createDomainTask,
  updateDomainTask,
  deleteDomainTask,
} from "../controllers/domainTaskController.js";
import {
  updateSiteSettings,
  getAdminPayments,
  verifyPaymentAdmin,
  getAdminSettings,
  getPaymentSchedule,
  setStudentPaymentPlan,
  bulkLoadPaymentPlans,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/verify", verifyUser);
router.patch("/users/:id/approve", approveStudent);
router.patch("/users/:id/reject", rejectStudent);
router.patch("/users/:id", updateUser);
router.patch("/users/:id/status", setUserStatus);
router.delete("/users/:id", deleteUser);
router.patch("/companies/:id/verify", verifyCompany);

router.get("/certificates", getAdminCertificates);
router.post("/certificates", issueCertificate);
router.post("/notifications/broadcast", broadcastNotification);
router.get("/applications", getAdminApplications);
router.get("/internships", getAdminInternships);
router.post("/internships", createAdminInternship);
router.put("/internships/:id", updateAdminInternship);
router.delete("/internships/:id", deleteAdminInternship);

router.get("/blogs", adminListBlogs);
router.post("/blogs", createBlog);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

router.get("/settings", getAdminSettings);
router.put("/settings", updateSiteSettings);
router.get("/payments", getAdminPayments);
router.patch("/payments/:id/verify", verifyPaymentAdmin);
router.get("/payment-schedule", getPaymentSchedule);
router.patch("/users/:id/payment-plan", setStudentPaymentPlan);
router.post("/payment-plans/bulk", bulkLoadPaymentPlans);

router.get("/tasks", getAdminTasks);
router.patch("/tasks/:id/review", reviewTask);

router.get("/domain-tasks", listDomainTasksAdmin);
router.post("/domain-tasks", createDomainTask);
router.put("/domain-tasks/:id", updateDomainTask);
router.delete("/domain-tasks/:id", deleteDomainTask);

export default router;

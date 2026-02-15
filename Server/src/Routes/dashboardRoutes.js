import express from "express";
import { getDashboard, getProfile, getRunnerDashboard, getRunnerStats } from "../Controllers/dashboardController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";

const router = express.Router();

// All dashboard routes require authentication
router.get("/", protect, getDashboard);
router.get("/profile", protect, getProfile);
router.get("/runner", protect, authorize("Student", "DeliveryPartner"), getRunnerDashboard);
router.get("/runner/stats", protect, authorize("Student", "DeliveryPartner"), getRunnerStats);

export default router;

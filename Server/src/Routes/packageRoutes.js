import express from "express";
import { createPackage, getMyPackages, getPackageById, getAvailablePackages, acceptPackage, updatePackageStatus, cancelPackage, getMyDeliveries } from "../Controllers/packageController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";

const router = express.Router();

// Student (customer) routes
router.post("/", protect, authorize("Student"), createPackage);
router.get("/my-packages", protect, authorize("Student"), getMyPackages);

// Runner routes (Student)
router.get("/available", protect, authorize("Student"), getAvailablePackages);
router.get("/my-deliveries", protect, authorize("Student"), getMyDeliveries);
router.put("/:id/accept", protect, authorize("Student"), acceptPackage);
router.put("/:id/status", protect, authorize("Student"), updatePackageStatus);

// Shared routes
router.get("/:id", protect, getPackageById);
router.put("/:id/cancel", protect, cancelPackage);

export default router;

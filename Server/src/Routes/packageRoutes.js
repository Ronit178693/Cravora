import express from "express";
import { createPackage, getMyPackages, getPackageById, getAvailablePackages, acceptPackage, updatePackageStatus, cancelPackage, getMyDeliveries } from "../Controllers/packageController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";

const router = express.Router();

// Student (customer) routes
router.post("/", protect, authorize("Student"), createPackage);
router.get("/my-packages", protect, authorize("Student"), getMyPackages);

// Runner routes (Student or DeliveryPartner)
router.get("/available", protect, authorize("Student", "DeliveryPartner"), getAvailablePackages);
router.get("/my-deliveries", protect, authorize("Student", "DeliveryPartner"), getMyDeliveries);
router.put("/:id/accept", protect, authorize("Student", "DeliveryPartner"), acceptPackage);
router.put("/:id/status", protect, authorize("Student", "DeliveryPartner"), updatePackageStatus);

// Shared routes
router.get("/:id", protect, getPackageById);
router.put("/:id/cancel", protect, cancelPackage);

export default router;

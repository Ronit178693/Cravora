import express from "express";
import { 
    createPackage, 
    getMyPackages, 
    getPackageById, 
    getAvailablePackages, 
    acceptPackage, 
    updatePackageStatus, 
    cancelPackage, 
    getMyDeliveries 
} from "../Controllers/packageController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * Package/Parcel Delivery Routes Router
 * Maps custom student parcel requests and runner delivery checkpoints.
 */

// --- Customer (Student) Routes ---

// Create a new package delivery request
router.post("/", protect, authorize("Student"), createPackage);

// Retrieve all package requests created by the active student
router.get("/my-packages", protect, authorize("Student"), getMyPackages);


// --- Delivery Runner Routes ---

// Get all pending package requests available for delivery on campus
router.get("/available", protect, authorize("Student"), getAvailablePackages);

// Get all package deliveries currently claimed by the active runner
router.get("/my-deliveries", protect, authorize("Student"), getMyDeliveries);

// Claim/accept a package delivery request
router.put("/:id/accept", protect, authorize("Student"), acceptPackage);

// Update status of claimed package (Accepted -> PickedUp -> Delivered)
router.put("/:id/status", protect, authorize("Student"), updatePackageStatus);


// --- Shared Routes ---

// View detailed info of a single package request (Customer or Runner only)
router.get("/:id", protect, getPackageById);

// Cancel a pending package request (Customer only)
router.put("/:id/cancel", protect, cancelPackage);

export default router;

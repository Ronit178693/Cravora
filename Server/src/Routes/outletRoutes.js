import express from "express";
import { 
    addOutlet, 
    getAllOutlets, 
    getOutletById, 
    getMyOutlet, 
    updateOutlet, 
    deleteOutlet 
} from "../Controllers/outletController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";
import upload from "../Middlewares/imageMiddleware.js";

const router = express.Router();

/**
 * Outlet Management Routes Router
 * Combines public viewing routes and protected outlet management controls.
 */

// --- Public Routes ---

// Get list of all outlets for student browsing
router.get("/allOutlet", getAllOutlets);

// Get specific details of a single outlet by ID
router.get("/getOutlet/:id", getOutletById);


// --- Protected Outlet Owner Routes ---

// Register/Add a new food outlet (restricts to Outlet role, includes single file image upload)
router.post("/addOutlet", protect, authorize("Outlet"), upload.single("image"), addOutlet);

// Get all outlets owned by the logged-in user
router.get("/me/outlet", protect, authorize("Outlet"), getMyOutlet);

// Update outlet details (including updating banner image)
router.put("/updateOutlet/:id", protect, authorize("Outlet"), upload.single("image"), updateOutlet);

// Delete an outlet record
router.delete("/deleteOutlet/:id", protect, authorize("Outlet"), deleteOutlet);

export default router;

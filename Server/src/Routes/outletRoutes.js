import express from "express";
import { addOutlet, getAllOutlets, getOutletById, getMyOutlet, updateOutlet, deleteOutlet } from "../Controllers/outletController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllOutlets);
router.get("/:id", getOutletById);

// Outlet owner routes
router.post("/", protect, authorize("Outlet"), addOutlet);
router.get("/me/outlet", protect, authorize("Outlet"), getMyOutlet);
router.put("/:id", protect, authorize("Outlet"), updateOutlet);
router.delete("/:id", protect, authorize("Outlet"), deleteOutlet);

export default router;

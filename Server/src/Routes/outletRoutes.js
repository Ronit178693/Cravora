import express from "express";
import { addOutlet, getAllOutlets, getOutletById, getMyOutlet, updateOutlet, deleteOutlet } from "../Controllers/outletController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";
import upload from "../Middlewares/imageMiddleware.js";
const router = express.Router();

// Public routes
router.get("/", getAllOutlets);
router.get("/:id", getOutletById);

// Outlet owner routes
router.post("/addOutlet", protect, authorize("Outlet"), upload.single("image"), addOutlet);
router.get("/me/outlet", protect, authorize("Outlet"), getMyOutlet);
router.put("/updateOutlet/:id", protect, authorize("Outlet"), upload.single("image"), updateOutlet);
router.delete("/deleteOutlet/:id", protect, authorize("Outlet"), deleteOutlet);

export default router;

import express from "express";
import { addMenuItem, updateMenuItem, deleteMenuItem } from "../Controllers/menuController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";
import upload from "../Middlewares/imageMiddleware.js";

const router = express.Router();

/**
 * Menu Management Routes Router (Restricted to Outlet Owners only)
 * Handles creating, updating, and deleting menu subdocuments inside Outlets.
 * Connects file upload middleware for optional menu item pictures.
 */

// Protected Route: Add new menu item to an outlet's menu
router.post("/addMenu-item/:id", protect, authorize("Outlet"), upload.single("image"), addMenuItem);

// Protected Route: Update details/image of an existing menu item
router.put("/:id/item/:itemId", protect, authorize("Outlet"), upload.single("image"), updateMenuItem);

// Protected Route: Remove a menu item from the outlet's menu
router.delete("/:id/item/:itemId", protect, authorize("Outlet"), deleteMenuItem);

export default router;

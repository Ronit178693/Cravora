import express from "express";
import { addMenuItem, updateMenuItem, deleteMenuItem } from "../Controllers/menuController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";

const router = express.Router();

// All menu routes require auth + Outlet role
router.post("/:id", protect, authorize("Outlet"), addMenuItem);
router.put("/:id/item/:itemId", protect, authorize("Outlet"), updateMenuItem);
router.delete("/:id/item/:itemId", protect, authorize("Outlet"), deleteMenuItem);

export default router;

import express from "express";
import { addMenuItem, updateMenuItem, deleteMenuItem } from "../Controllers/menuController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";
import upload from "../Middlewares/imageMiddleware.js";

const router = express.Router();

// All menu routes require auth + Outlet role
router.post("/addMenu-item/:id", protect, authorize("Outlet"), upload.single("image"), addMenuItem);
router.put("/:id/item/:itemId", protect, authorize("Outlet"), upload.single("image"), updateMenuItem);
router.delete("/:id/item/:itemId", protect, authorize("Outlet"), deleteMenuItem);

export default router;

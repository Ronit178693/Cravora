import express from "express";
import { placeOrder, getMyOrders, getOrderById, getOutletOrders, acceptOrder, updateOrderStatus, cancelOrder, getAvailableOrders, acceptDelivery, getMyOrderDeliveries } from "../Controllers/orderController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";

const router = express.Router();

// Student (customer) routes
router.post("/", protect, authorize("Student"), placeOrder);
router.get("/my-orders", protect, authorize("Student"), getMyOrders);

// Outlet owner routes
router.get("/outlet-orders", protect, authorize("Outlet"), getOutletOrders);
router.put("/:id/accept", protect, authorize("Outlet"), acceptOrder);

// Runner routes (Student or DeliveryPartner)
router.get("/available", protect, authorize("Student", "DeliveryPartner"), getAvailableOrders);
router.get("/my-deliveries", protect, authorize("Student", "DeliveryPartner"), getMyOrderDeliveries);
router.put("/:id/accept-delivery", protect, authorize("Student", "DeliveryPartner"), acceptDelivery);

// Shared routes (customer, outlet owner, or runner)
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, updateOrderStatus);
router.put("/:id/cancel", protect, cancelOrder);

export default router;

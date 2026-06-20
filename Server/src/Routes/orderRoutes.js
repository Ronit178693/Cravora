import express from "express";
import { 
    placeOrder, 
    getMyOrders, 
    getOrderById, 
    getOutletOrders, 
    acceptOrder, 
    updateOrderStatus, 
    cancelOrder, 
    getAvailableOrders, 
    acceptDelivery, 
    getMyOrderDeliveries 
} from "../Controllers/orderController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { authorize } from "../Middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * Food Ordering Routes Router
 * Maps customer ordering, outlet preparation, and runner delivery endpoints.
 */

// --- Customer (Student) Routes ---

// Place a new food order
router.post("/", protect, authorize("Student"), placeOrder);

// Retrieve the logged-in customer's order history
router.get("/my-orders", protect, authorize("Student"), getMyOrders);


// --- Outlet Owner Routes ---

// Retrieve all incoming orders for the logged-in owner's outlets
router.get("/outlet-orders", protect, authorize("Outlet"), getOutletOrders);

// Accept a pending order at the outlet
router.put("/:id/accept", protect, authorize("Outlet"), acceptOrder);


// --- Delivery Runner Routes ---

// Get all orders available for pickup on campus (status: "Preparing")
router.get("/available", protect, authorize("Student"), getAvailableOrders);

// Get all deliveries currently claimed by the active runner
router.get("/my-deliveries", protect, authorize("Student"), getMyOrderDeliveries);

// Claim/accept an available order for delivery
router.put("/:id/accept-delivery", protect, authorize("Student"), acceptDelivery);


// --- Shared Routes ---

// View detailed info of a single order (Customer, Owner, or Runner only)
router.get("/:id", protect, getOrderById);

// Update status progression (e.g. mark preparing or delivered)
router.put("/:id/status", protect, updateOrderStatus);

// Cancel a pending/accepted order
router.put("/:id/cancel", protect, cancelOrder);

export default router;

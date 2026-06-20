import Order from "../Models/Order.js";
import Outlet from "../Models/Outlet.js";
import User from "../Models/User.js";

/**
 * Controller: Place a new food order
 * Validates the outlet, calculates the price securely by fetching menu item prices from the database,
 * enforces the server-controlled flat delivery fee (₹15), creates the order document,
 * and updates user order history and outlet order count.
 */
export const placeOrder = async (req, res) => {
    const userID = req.user.id;
    try {
        const { outletId, items, dropLocation } = req.body;

        // Step 1: Validate that required fields are present in the request body
        if (!outletId || !items || !items.length || !dropLocation) {
            return res.status(400).json({ success: false, message: "outletId, items, and dropLocation are required" });
        }

        // Step 2: Retrieve the outlet from the database to ensure it exists and get its pickup location
        const outlet = await Outlet.findById(outletId);
        if (!outlet) {
            return res.status(404).json({ success: false, message: "Outlet not found" });
        }

        // Step 3: Validate each ordered item against the database menu to secure against price manipulation
        let calculatedTotal = 0;
        const verifiedItems = [];

        for (const item of items) {
            // Find the item in the outlet's menu subdocument array
            const menuItem = outlet.menu.id(item.menuItemId);
            if (!menuItem) {
                return res.status(400).json({ success: false, message: `Menu item '${item.name}' not found in this outlet` });
            }
            if (!menuItem.isAvailable) {
                return res.status(400).json({ success: false, message: `Menu item '${item.name}' is currently unavailable` });
            }

            // Sum the total price of items securely
            calculatedTotal += menuItem.price * (item.quantity || 1);

            // Construct the item entry using verified details from the database
            verifiedItems.push({
                menuItemId: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity || 1,
                image: menuItem.image
            });
        }

        // Step 4: Enforce a flat delivery fee on the server level (prevents fee tampering)
        const FLAT_DELIVERY_FEE = 15;

        // Step 5: Save the new order record to the database
        const order = await Order.create({
            customer: userID,
            outlet: outletId,
            items: verifiedItems,
            pickupLocation: outlet.location,
            dropLocation,
            totalAmount: calculatedTotal,
            deliveryFee: FLAT_DELIVERY_FEE
        });

        // Step 6: Link this order to the customer's order history profile
        await User.findByIdAndUpdate(userID, {
            $push: { orderHistory: { order: order._id } }
        });

        // Step 7: Update the outlet's stats (increment order count, link order record)
        await Outlet.findByIdAndUpdate(outletId, {
            $inc: { orderCount: 1 },
            $push: { orders: { order: order._id } }
        });

        return res.status(201).json({ success: true, message: "Order placed successfully", order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Get logged-in customer's order history
 * Fetches all orders placed by the current student, populates outlet and runner details,
 * and sorts them from newest to oldest.
 */
export const getMyOrders = async (req, res) => {
    const userID = req.user.id;
    try {
        // Find all orders where customer matches userID, populating linked document fields
        const orders = await Order.find({ customer: userID })
            .populate("outlet", "name location images")
            .populate("runner", "name phoneNumber")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Get detailed view of a single order by ID
 * Validates permissions: Only the customer who placed the order, the outlet owner
 * who prepared it, or the runner assigned to deliver it can access this information.
 */
export const getOrderById = async (req, res) => {
    try {
        // Retrieve the order, populating all linked user and outlet references
        const order = await Order.findById(req.params.id)
            .populate("customer", "name email phoneNumber")
            .populate("outlet", "name location images")
            .populate("runner", "name phoneNumber");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Fetch the outlet to identify the owner
        const outlet = await Outlet.findById(order.outlet._id || order.outlet);
        const isCustomer = order.customer._id.toString() === req.user.id;
        const isOutletOwner = outlet && outlet.owner.toString() === req.user.id;
        const isRunner = order.runner && order.runner._id.toString() === req.user.id;

        // Block access if the user is not associated with this order
        if (!isCustomer && !isOutletOwner && !isRunner) {
            return res.status(403).json({ success: false, message: "You are not authorized to view this order" });
        }

        return res.status(200).json({ success: true, order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Get all orders for an outlet owner
 * Identifies all outlets owned by the logged-in user, retrieves all orders placed
 * at those outlets, and populates customer and runner profiles.
 */
export const getOutletOrders = async (req, res) => {
    try {
        // Step 1: Find all outlets owned by the active user
        const outlets = await Outlet.find({ owner: req.user.id });
        if (!outlets || outlets.length === 0) {
            return res.status(404).json({ success: false, message: "You don't have an outlet registered" });
        }
        
        // Extract array of outlet IDs
        const outletIds = outlets.map(o => o._id);
        
        // Step 2: Retrieve all orders that belong to the list of outlet IDs
        const orders = await Order.find({ outlet: { $in: outletIds } })
            .populate("customer", "name email phoneNumber")
            .populate("runner", "name phoneNumber")
            .populate("outlet", "name location")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Accept an incoming order (Outlet Owner)
 * Verifies ownership of the preparing outlet and moves the order status from "Pending" to "Accepted".
 */
export const acceptOrder = async (req, res) => {
    try {
        // Find the target order
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Verify that the logged-in user is the actual owner of the outlet preparing this order
        const outlet = await Outlet.findById(order.outlet);
        if (!outlet || outlet.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to accept this order" });
        }

        // Ensure order is in "Pending" status before accepting
        if (order.status !== "Pending") {
            return res.status(400).json({ success: false, message: `Order cannot be accepted, current status: ${order.status}` });
        }

        // Update status and save
        order.status = "Accepted";
        await order.save();

        return res.status(200).json({ success: true, message: "Order accepted", order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Update order status (Outlet Owner or Runner)
 * Updates the progression status (Accepted -> Preparing -> Delivered).
 * Restricts updates to authorised users and validates correct status flow progression.
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Accepted", "Preparing", "Delivered"];

        // Step 1: Check if the new status is valid
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Step 2: Validate authority (Only outlet owner or assigned runner can modify)
        const outlet = await Outlet.findById(order.outlet);
        const isOutletOwner = outlet && outlet.owner.toString() === req.user.id;
        const isRunner = order.runner && order.runner.toString() === req.user.id;

        if (!isOutletOwner && !isRunner) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this order" });
        }

        // Step 3: Enforce logical status transition flow
        const statusFlow = {
            "Pending": "Accepted",
            "Accepted": "Preparing",
            "OutForDelivery": "Delivered"
        };

        if (statusFlow[order.status] !== status) {
            return res.status(400).json({ success: false, message: `Cannot move from '${order.status}' to '${status}'. Next valid status: '${statusFlow[order.status] || "use acceptDelivery"}'` });
        }

        // Step 4: Save new status. If "Delivered", log timestamp and increment runner completion stats
        order.status = status;
        if (status === "Delivered") {
            order.deliveredAt = new Date();
            
            if (order.runner) {
                await User.findByIdAndUpdate(order.runner, {
                    $inc: { "deliveryStats.deliveriesCompleted": 1 },
                    $set: { "deliveryStats.lastDeliveryAt": new Date() }
                });
            }
        }
        await order.save();

        return res.status(200).json({ success: true, message: `Order status updated to ${status}`, order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Cancel an order (Customer or Outlet Owner)
 * Allows order cancellation ONLY if the order is still "Pending" or "Accepted".
 */
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Verify permissions (Customer who ordered or Outlet owner)
        const isCustomer = order.customer.toString() === req.user.id;
        const outlet = await Outlet.findById(order.outlet);
        const isOutletOwner = outlet && outlet.owner.toString() === req.user.id;

        if (!isCustomer && !isOutletOwner) {
            return res.status(403).json({ success: false, message: "You are not authorized to cancel this order" });
        }

        // Ensure order is not already in preparation or out for delivery
        if (!["Pending", "Accepted"].includes(order.status)) {
            return res.status(400).json({ success: false, message: `Order cannot be cancelled, current status: ${order.status}` });
        }

        // Cancel order and save
        order.status = "Cancelled";
        await order.save();

        return res.status(200).json({ success: true, message: "Order cancelled successfully", order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Get all food orders available for delivery (Runner Dashboard)
 * Finds all orders that are currently "Preparing" and have not yet been claimed by a runner.
 */
export const getAvailableOrders = async (req, res) => {
    try {
        // Fetch matching orders, populating customer and outlet info for runner visibility
        const orders = await Order.find({
            status: "Preparing",
            runner: null
        })
            .populate("customer", "name phoneNumber")
            .populate("outlet", "name location")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Accept a delivery request (Runner)
 * Assigns the logged-in runner user to the order and updates its status to "OutForDelivery".
 * Blocks customers from accepting their own orders.
 */
export const acceptDelivery = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Ensure the order is ready for pickup and unclaimed
        if (order.status !== "Preparing") {
            return res.status(400).json({ success: false, message: "This order is not available for delivery" });
        }

        if (order.runner) {
            return res.status(400).json({ success: false, message: "This order already has a runner assigned" });
        }

        // Prevent a customer from accepting their own order for delivery
        if (order.customer.toString() === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot deliver your own order" });
        }

        // Assign runner and advance status
        order.runner = req.user.id;
        order.status = "OutForDelivery";
        await order.save();

        return res.status(200).json({ success: true, message: "Delivery accepted! Pick up the order.", order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Get active/past deliveries for a runner
 * Retrieves all orders claimed by the current runner.
 */
export const getMyOrderDeliveries = async (req, res) => {
    const userID = req.user.id;
    try {
        // Query orders assigned to the active user
        const orders = await Order.find({ runner: userID })
            .populate("customer", "name phoneNumber")
            .populate("outlet", "name location images")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
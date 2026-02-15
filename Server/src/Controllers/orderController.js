import Order from "../Models/Order.js";
import Outlet from "../Models/Outlet.js";


// Place a new order (Customer)
export const placeOrder = async (req, res) => {
    const userID = req.user.id;
    try {
        const { outletId, items, dropLocation, deliveryFee } = req.body;

        // Validate required fields
        if (!outletId || !items || !items.length || !dropLocation) {
            return res.status(400).json({ success: false, message: "outletId, items, and dropLocation are required" });
        }

        // Fetch the outlet to get pickup location
        const outlet = await Outlet.findById(outletId);
        if (!outlet) {
            return res.status(404).json({ success: false, message: "Outlet not found" });
        }

        // Calculate total amount from items
        const totalAmount = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

        const order = await Order.create({
            customer: userID,
            outlet: outletId,
            items,
            pickupLocation: outlet.location,
            dropLocation,
            totalAmount,
            deliveryFee: deliveryFee || 0,
        });

        return res.status(201).json({ success: true, message: "Order placed successfully", order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Get all orders of the logged-in customer
export const getMyOrders = async (req, res) => {
    const userID = req.user.id;
    try {
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


// Get a single order by ID (Customer, Outlet Owner, or Runner)
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customer", "name email phoneNumber")
            .populate("outlet", "name location images")
            .populate("runner", "name phoneNumber");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Authorization: only customer, outlet owner, or assigned runner can view
        const outlet = await Outlet.findById(order.outlet._id || order.outlet);
        const isCustomer = order.customer._id.toString() === req.user.id;
        const isOutletOwner = outlet && outlet.owner.toString() === req.user.id;
        const isRunner = order.runner && order.runner._id.toString() === req.user.id;

        if (!isCustomer && !isOutletOwner && !isRunner) {
            return res.status(403).json({ success: false, message: "You are not authorized to view this order" });
        }

        return res.status(200).json({ success: true, order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Get all orders for the logged-in outlet owner
export const getOutletOrders = async (req, res) => {
    try {
        // Find the outlet owned by the logged-in user
        const outlet = await Outlet.findOne({ owner: req.user.id });
        if (!outlet) {
            return res.status(404).json({ success: false, message: "You don't have an outlet registered" });
        }

        const orders = await Order.find({ outlet: outlet._id })
            .populate("customer", "name email phoneNumber")
            .populate("runner", "name phoneNumber")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Accept an order (Outlet Owner)
export const acceptOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Verify the logged-in user owns the outlet
        const outlet = await Outlet.findById(order.outlet);
        if (!outlet || outlet.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to accept this order" });
        }

        if (order.status !== "Pending") {
            return res.status(400).json({ success: false, message: `Order cannot be accepted, current status: ${order.status}` });
        }

        order.status = "Accepted";
        await order.save();

        return res.status(200).json({ success: true, message: "Order accepted", order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Update order status (Outlet Owner or Runner)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Accepted", "Preparing", "Delivered"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Authorization: outlet owner or assigned runner
        const outlet = await Outlet.findById(order.outlet);
        const isOutletOwner = outlet && outlet.owner.toString() === req.user.id;
        const isRunner = order.runner && order.runner.toString() === req.user.id;

        if (!isOutletOwner && !isRunner) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this order" });
        }

        // Status flow validation
        // Note: Preparing → OutForDelivery is handled by acceptDelivery (runner only)
        const statusFlow = {
            "Pending": "Accepted",
            "Accepted": "Preparing",
            "OutForDelivery": "Delivered"
        };

        if (statusFlow[order.status] !== status) {
            return res.status(400).json({ success: false, message: `Cannot move from '${order.status}' to '${status}'. Next valid status: '${statusFlow[order.status] || "use acceptDelivery"}'` });
        }

        order.status = status;
        if (status === "Delivered") {
            order.deliveredAt = new Date();
        }
        await order.save();

        return res.status(200).json({ success: true, message: `Order status updated to ${status}`, order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Cancel an order (Customer or Outlet Owner, only if Pending or Accepted)
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Authorization: only customer or outlet owner can cancel
        const isCustomer = order.customer.toString() === req.user.id;
        const outlet = await Outlet.findById(order.outlet);
        const isOutletOwner = outlet && outlet.owner.toString() === req.user.id;

        if (!isCustomer && !isOutletOwner) {
            return res.status(403).json({ success: false, message: "You are not authorized to cancel this order" });
        }

        // Can only cancel if still Pending or Accepted
        if (!["Pending", "Accepted"].includes(order.status)) {
            return res.status(400).json({ success: false, message: `Order cannot be cancelled, current status: ${order.status}` });
        }

        order.status = "Cancelled";
        await order.save();

        return res.status(200).json({ success: true, message: "Order cancelled successfully", order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Get all orders available for delivery (Runner)
export const getAvailableOrders = async (req, res) => {
    try {
        // Orders that are ready for pickup and don't have a runner yet
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


// Accept a delivery (Runner)
export const acceptDelivery = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Order must be in Preparing status and have no runner
        if (order.status !== "Preparing") {
            return res.status(400).json({ success: false, message: "This order is not available for delivery" });
        }

        if (order.runner) {
            return res.status(400).json({ success: false, message: "This order already has a runner assigned" });
        }

        // A customer cannot deliver their own order
        if (order.customer.toString() === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot deliver your own order" });
        }

        order.runner = req.user.id;
        order.status = "OutForDelivery";
        await order.save();

        return res.status(200).json({ success: true, message: "Delivery accepted! Pick up the order.", order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
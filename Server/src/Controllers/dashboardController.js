import User from "../Models/User.js";
import Outlet from "../Models/Outlet.js";
import Order from "../Models/Order.js";
import Package from "../Models/Package.js";

/**
 * Controller: Get user profile with order history and runner/delivery statistics
 * Fetches the user profile, populates their past orders, and calculates counts
 * for total orders, packages ordered, and successful deliveries completed as a runner.
 */
export const getProfile = async (req, res) => {
    try {
        // Step 1: Find the user by ID, populating order history, excluding OTP fields
        const user = await User.findById(req.user.id)
            .select("-otp -otpExpires")
            .populate("orderHistory.order");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Step 2: Calculate user statistics: total food orders placed
        const totalOrders = await Order.countDocuments({ customer: req.user.id });
        
        // Step 3: Calculate total package delivery requests placed
        const totalPackages = await Package.countDocuments({ customer: req.user.id });
        
        // Step 4: Calculate total successful deliveries completed as a runner (food + packages)
        const totalDeliveries = await Order.countDocuments({ runner: req.user.id, status: "Delivered" })
            + await Package.countDocuments({ runner: req.user.id, status: "Delivered" });

        // Step 5: Respond with user profile and calculated statistics
        return res.status(200).json({
            success: true,
            user,
            stats: {
                totalOrders,
                totalPackages,
                totalDeliveries
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

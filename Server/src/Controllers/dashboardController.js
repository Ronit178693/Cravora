import User from "../Models/User.js";
import Outlet from "../Models/Outlet.js";
import Order from "../Models/Order.js";
import Package from "../Models/Package.js";


// Get main dashboard data — user profile + all open outlets (Student)
export const getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-otp -otpExpires");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Get all open outlets with their menu for browsing
        const outlets = await Outlet.find({ isOpen: true })
            .populate("owner", "name phoneNumber")
            .select("name description location images WorkingHours isOpen menu");

        return res.status(200).json({ success: true, user, outlets });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Get user profile with order history and delivery stats
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-otp -otpExpires")
            .populate("orderHistory.order");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Get counts for quick stats
        const totalOrders = await Order.countDocuments({ customer: req.user.id });
        const totalPackages = await Package.countDocuments({ customer: req.user.id });
        const totalDeliveries = await Order.countDocuments({ runner: req.user.id, status: "Delivered" })
            + await Package.countDocuments({ runner: req.user.id, status: "Delivered" });

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


// Get all available deliveries for a runner (both food orders and packages)
export const getRunnerDashboard = async (req, res) => {
    try {
        // Available food orders — preparing/out-for-delivery with no runner
        const availableOrders = await Order.find({
            status: "Preparing",
            runner: null
        })
            .populate("customer", "name phoneNumber")
            .populate("outlet", "name location")
            .sort({ createdAt: -1 });

        // Available packages — pending with no runner
        const availablePackages = await Package.find({
            status: "Pending",
            runner: null
        })
            .populate("customer", "name phoneNumber")
            .sort({ createdAt: -1 });

        // Runner's active deliveries (accepted but not yet delivered)
        const myActiveDeliveries = await Order.find({
            runner: req.user.id,
            status: { $in: ["OutForDelivery"] }
        })
            .populate("customer", "name phoneNumber")
            .populate("outlet", "name location")
            .sort({ createdAt: -1 });

        const myActivePackages = await Package.find({
            runner: req.user.id,
            status: { $in: ["Accepted", "PickedUp"] }
        })
            .populate("customer", "name phoneNumber")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            available: {
                orders: availableOrders,
                packages: availablePackages
            },
            active: {
                orders: myActiveDeliveries,
                packages: myActivePackages
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Get runner's delivery history and stats
export const getRunnerStats = async (req, res) => {
    try {
        const completedOrders = await Order.find({
            runner: req.user.id,
            status: "Delivered"
        })
            .populate("outlet", "name")
            .sort({ deliveredAt: -1 });

        const completedPackages = await Package.find({
            runner: req.user.id,
            status: "Delivered"
        })
            .sort({ deliveredAt: -1 });

        const totalEarnings = completedOrders.reduce((sum, order) => sum + (order.deliveryFee || 0), 0)
            + completedPackages.reduce((sum, pkg) => sum + (pkg.deliveryFee || 0), 0);

        return res.status(200).json({
            success: true,
            stats: {
                totalDeliveries: completedOrders.length + completedPackages.length,
                foodDeliveries: completedOrders.length,
                packageDeliveries: completedPackages.length,
                totalEarnings
            },
            history: {
                orders: completedOrders,
                packages: completedPackages
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

import Package from "../Models/Package.js";


// Create a new package delivery request (Customer)
export const createPackage = async (req, res) => {
    const userID = req.user.id;
    try {
        const { type, description, quantity, pickupLocation, dropLocation, deliveryFee, instructions } = req.body;

        if (!type || !pickupLocation || !dropLocation) {
            return res.status(400).json({ success: false, message: "type, pickupLocation, and dropLocation are required" });
        }

        const validTypes = ["Courier", "Blinket", "Food"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ success: false, message: `Invalid type. Must be one of: ${validTypes.join(", ")}` });
        }

        const pkg = await Package.create({
            customer: userID,
            type,
            description,
            quantity: quantity || 1,
            pickupLocation,
            dropLocation,
            deliveryFee: deliveryFee || 0,
            instructions
        });

        return res.status(201).json({ success: true, message: "Package delivery request created", package: pkg });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Get all packages of the logged-in customer
export const getMyPackages = async (req, res) => {
    const userID = req.user.id;
    try {
        const packages = await Package.find({ customer: userID })
            .populate("customer", "name phoneNumber")
            .populate("runner", "name phoneNumber")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, packages });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Get a single package by ID (Customer or assigned Runner)
export const getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id)
            .populate("customer", "name phoneNumber")
            .populate("runner", "name phoneNumber");

        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        const isCustomer = pkg.customer._id.toString() === req.user.id;
        const isRunner = pkg.runner && pkg.runner._id.toString() === req.user.id;

        if (!isCustomer && !isRunner) {
            return res.status(403).json({ success: false, message: "You are not authorized to view this package" });
        }

        return res.status(200).json({ success: true, package: pkg });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Get all packages available for pickup (Runner)
export const getAvailablePackages = async (req, res) => {
    try {
        const packages = await Package.find({
            status: "Pending",
            runner: null
        })
            .populate("customer", "name phoneNumber")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, packages });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Accept a package delivery (Runner)
export const acceptPackage = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        if (pkg.status !== "Pending") {
            return res.status(400).json({ success: false, message: "This package is not available for delivery" });
        }

        if (pkg.runner) {
            return res.status(400).json({ success: false, message: "This package already has a runner assigned" });
        }

        // A customer cannot deliver their own package
        if (pkg.customer.toString() === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot deliver your own package" });
        }

        pkg.runner = req.user.id;
        pkg.status = "Accepted";
        await pkg.save();

        return res.status(200).json({ success: true, message: "Package accepted! Head to the pickup location.", package: pkg });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Update package status (Runner only)
export const updatePackageStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["PickedUp", "Delivered"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        // Only the assigned runner can update status
        if (!pkg.runner || pkg.runner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this package" });
        }

        // Status flow validation
        const statusFlow = {
            "Accepted": "PickedUp",
            "PickedUp": "Delivered"
        };

        if (statusFlow[pkg.status] !== status) {
            return res.status(400).json({ success: false, message: `Cannot move from '${pkg.status}' to '${status}'. Next valid status: '${statusFlow[pkg.status]}'` });
        }

        pkg.status = status;
        if (status === "Delivered") {
            pkg.deliveredAt = new Date();
        }
        await pkg.save();

        return res.status(200).json({ success: true, message: `Package status updated to ${status}`, package: pkg });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Cancel a package (Customer only, if still Pending)
export const cancelPackage = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        if (pkg.customer.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to cancel this package" });
        }

        if (pkg.status !== "Pending") {
            return res.status(400).json({ success: false, message: `Package cannot be cancelled, current status: ${pkg.status}` });
        }

        pkg.status = "Cancelled";
        await pkg.save();

        return res.status(200).json({ success: true, message: "Package cancelled successfully", package: pkg });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


// Get all deliveries for the logged-in runner
export const getMyDeliveries = async (req, res) => {
    const userID = req.user.id;
    try {
        const packages = await Package.find({ runner: userID })
            .populate("customer", "name phoneNumber")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, packages });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

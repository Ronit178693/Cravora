import Package from "../Models/Package.js";

/**
 * Controller: Create a new parcel request (Customer)
 * Validates package type, coordinates, and custom delivery fee (tip), 
 * and stores the package delivery task in the database.
 */
export const createPackage = async (req, res) => {
    const userID = req.user.id;
    try {
        const { type, description, quantity, pickupLocation, dropLocation, deliveryFee, instructions } = req.body;

        // Step 1: Validate that required fields are present
        if (!type || !pickupLocation || !dropLocation) {
            return res.status(400).json({ success: false, message: "type, pickupLocation, and dropLocation are required" });
        }

        // Step 2: Ensure the package type is valid
        const validTypes = ["Courier", "Blinket", "Food"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ success: false, message: `Invalid type. Must be one of: ${validTypes.join(", ")}` });
        }

        // Step 3: Validate that the custom delivery fee/tip is a non-negative number
        if (deliveryFee !== undefined && (typeof deliveryFee !== "number" || deliveryFee < 0)) {
            return res.status(400).json({ success: false, message: "Delivery fee must be a positive number" });
        }

        // Step 4: Create and save the new package request document
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

/**
 * Controller: Get logged-in customer's package requests
 * Retrieves all packages created by the active student.
 */
export const getMyPackages = async (req, res) => {
    const userID = req.user.id;
    try {
        // Query packages where customer matches, populating customer and runner profiles
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

/**
 * Controller: Get detailed view of a single package request by ID
 * Restricts access: Only the requesting customer or the assigned delivery runner can view.
 */
export const getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id)
            .populate("customer", "name phoneNumber")
            .populate("runner", "name phoneNumber");

        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        // Verify authorization
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

/**
 * Controller: Get all package requests available for delivery (Runner Dashboard)
 * Finds packages with status "Pending" and no runner assigned.
 */
export const getAvailablePackages = async (req, res) => {
    try {
        // Find unclaimed pending package requests
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

/**
 * Controller: Accept a package delivery request (Runner)
 * Claims the package request and assigns the runner. Customers cannot claim their own packages.
 */
export const acceptPackage = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        // Verify the package is still unclaimed and pending
        if (pkg.status !== "Pending") {
            return res.status(400).json({ success: false, message: "This package is not available for delivery" });
        }

        if (pkg.runner) {
            return res.status(400).json({ success: false, message: "This package already has a runner assigned" });
        }

        // Block customer from acting as the runner for their own package
        if (pkg.customer.toString() === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot deliver your own package" });
        }

        // Assign runner and update status
        pkg.runner = req.user.id;
        pkg.status = "Accepted";
        await pkg.save();

        return res.status(200).json({ success: true, message: "Package accepted! Head to the pickup location.", package: pkg });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Update package delivery status (Runner)
 * Updates progression status (Accepted -> PickedUp -> Delivered).
 * Restricts updates to the assigned runner.
 */
export const updatePackageStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["PickedUp", "Delivered"];

        // Step 1: Validate new status value
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        // Step 2: Verify that the requester is the assigned runner
        if (!pkg.runner || pkg.runner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this package" });
        }

        // Step 3: Validate status flow progression
        const statusFlow = {
            "Accepted": "PickedUp",
            "PickedUp": "Delivered"
        };

        if (statusFlow[pkg.status] !== status) {
            return res.status(400).json({ success: false, message: `Cannot move from '${pkg.status}' to '${status}'. Next valid status: '${statusFlow[pkg.status]}'` });
        }

        // Step 4: Advance status, logging timestamp if delivered
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

/**
 * Controller: Cancel a package delivery request (Customer)
 * Allows the customer to cancel the request only if it is still unclaimed (Pending).
 */
export const cancelPackage = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        // Ensure the requester is the owner of the package request
        if (pkg.customer.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to cancel this package" });
        }

        // Ensure package is not already accepted/delivered
        if (pkg.status !== "Pending") {
            return res.status(400).json({ success: false, message: `Package cannot be cancelled, current status: ${pkg.status}` });
        }

        // Mark as cancelled and save
        pkg.status = "Cancelled";
        await pkg.save();

        return res.status(200).json({ success: true, message: "Package cancelled successfully", package: pkg });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Get all packages assigned to a runner
 * Retrieves all package deliveries claimed by the active runner.
 */
export const getMyDeliveries = async (req, res) => {
    const userID = req.user.id;
    try {
        // Query packages assigned to the runner
        const packages = await Package.find({ runner: userID })
            .populate("customer", "name phoneNumber")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, packages });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

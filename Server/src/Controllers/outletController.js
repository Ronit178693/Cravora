import Outlet from "../Models/Outlet.js";
import User from "../Models/User.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * Controller: Register a new outlet (Outlet Owners only)
 * Creates a new outlet record in the database, associates it with the logged-in owner,
 * parses working hours, and sends a welcome email to the owner.
 */
export const addOutlet = async (req, res) => {
    let { name, description, location, contactNumber, WorkingHours } = req.body;
    try {
        // Step 1: Ensure name and location are provided
        if (!name || !location) {
            return res.status(400).json({ success: false, message: "Name and location are required" });
        }

        // Step 2: Parse WorkingHours if received as a string (common when files are uploaded via FormData)
        if (typeof WorkingHours === 'string') {
            try {
                WorkingHours = JSON.parse(WorkingHours);
            } catch (error) {
                console.error("Error parsing WorkingHours:", error);
                return res.status(400).json({ success: false, message: "Invalid format for WorkingHours" });
            }
        }

        // Step 3: Create the outlet document, mapping the single image file if uploaded
        const outlet = await Outlet.create({
            owner: req.user.id,
            name,
            description,
            location,
            contactNumber,
            images: req.file ? [req.file.path] : [],
            WorkingHours
        });

        // Step 4: Email a welcome message to the outlet owner
        try {
            const user = await User.findById(req.user.id);
            sendEmail(
                user.email,
                "Welcome to Cravora",
                `<h1>Hi ${name}</h1>
                <p>Thank you for registering your outlet with Cravora!</p>
                <p>Your outlet is now live and students can start ordering.</p>
                <p>Best Regards</p>
                <p>Cravora</p>`
            );
        }
        catch (error) {
            console.log("Welcome email failed:", error.message);
        }

        return res.status(201).json({ success: true, message: "Outlet added successfully", outlet });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Get all registered outlets (Public)
 * Returns a list of all outlets for student browsing.
 */
export const getAllOutlets = async (req, res) => {
    try {
        // Find all outlets and populate the owner's public details
        const outlets = await Outlet.find().populate("owner", "name email phoneNumber");
        return res.status(200).json({ success: true, outlets });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Get a single outlet by ID (Public)
 * Fetches outlet details and menu for displaying the outlet menu page.
 */
export const getOutletById = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id).populate("owner", "name email phoneNumber");
        if (!outlet) {
            return res.status(404).json({ success: false, message: "Outlet not found" });
        }
        return res.status(200).json({ success: true, outlet });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Get outlets owned by the logged-in user (Outlet Dashboard)
 * Returns all outlets created by the active owner account.
 * Returns an empty array with 200 OK if no outlets exist (prevents frontend Axios errors).
 */
export const getMyOutlet = async (req, res) => {
    const userID = req.user.id;
    try {
        // Query outlets matching the owner field
        const outlets = await Outlet.find({ owner: userID });
        return res.status(200).json({ success: true, outlets: outlets || [] });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Update outlet details (Owner only)
 * Authorises owner checks, accepts text/image updates, and saves modifications.
 */
export const updateOutlet = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) {
            return res.status(404).json({ success: false, message: "Outlet not found" });
        }
        
        // Verify owner authorization
        if (outlet.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this outlet" });
        }

        const { name, description, location, contactNumber, WorkingHours, isOpen } = req.body;
        
        // Update only the properties sent in the request body
        if (name !== undefined) outlet.name = name;
        if (description !== undefined) outlet.description = description;
        if (location !== undefined) outlet.location = location;
        if (contactNumber !== undefined) outlet.contactNumber = contactNumber;
        if (req.file) outlet.images = [req.file.path];
        if (WorkingHours !== undefined) outlet.WorkingHours = WorkingHours;
        if (isOpen !== undefined) outlet.isOpen = isOpen;

        await outlet.save();
        return res.status(200).json({ success: true, message: "Outlet updated successfully", outlet });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Delete an outlet (Owner only)
 * Removes the outlet document from the database after verifying owner status.
 */
export const deleteOutlet = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) {
            return res.status(404).json({ success: false, message: "Outlet not found" });
        }

        // Verify owner authorization
        if (outlet.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this outlet" });
        }

        // Remove the outlet record
        await Outlet.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: "Outlet deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

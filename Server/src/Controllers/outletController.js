import Outlet from "../Models/Outlet.js";
import User from "../Models/User.js";
import { transporter } from "../Transporter.js";

// Send Email Function
const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: `"Cravora" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent
    };
    await transporter.sendMail(mailOptions);
};

// Create a new outlet (Only Outlet role users)
export const addOutlet = async (req, res) => {
    const { name, description, location, contactNumber, images, WorkingHours } = req.body;
    try {
        if (!name || !location) {
            return res.status(400).json({ success: false, message: "Name and location are required" });
        }
        // Set the owner to the logged-in user
        const outlet = await Outlet.create({
            owner: req.user.id,
            name,
            description,
            location,
            contactNumber,
            images,
            WorkingHours
        });
        // Send welcome email to the outlet owner
        try {
            const user = await User.findById(req.user.id);
            await sendEmail(
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

// Get all outlets (Public - for students browsing)
export const getAllOutlets = async (req, res) => {
    try {
        // Telling mongoose to populate the owner field with the name, email, and phoneNumber fields instead of userID
        const outlets = await Outlet.find().populate("owner", "name email phoneNumber");
        return res.status(200).json({ success: true, outlets });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Get a single outlet by ID (Public)
// Responses the Outlet details for a perticular outlet by its id
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

// Get the logged-in user's outlet
export const getMyOutlet = async (req, res) => {
    const userID = req.user.id;
    try {
        const outlet = await Outlet.findOne({ owner: userID });
        if (!outlet) {
            return res.status(404).json({ success: false, message: "You don't have an outlet registered" });
        }
        return res.status(200).json({ success: true, outlet });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Update outlet details (Only the owner)
export const updateOutlet = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) {
            return res.status(404).json({ success: false, message: "Outlet not found" });
        }
        // Check if the logged-in user is the owner
        if (outlet.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this outlet" });
        }
        const { name, description, location, contactNumber, images, WorkingHours, isOpen } = req.body;
        // Update only the fields that are provided
        if (name) outlet.name = name;
        if (description) outlet.description = description;
        if (location) outlet.location = location;
        if (contactNumber) outlet.contactNumber = contactNumber;
        if (images) outlet.images = images;
        if (WorkingHours) outlet.WorkingHours = WorkingHours;
        if (isOpen !== undefined) outlet.isOpen = isOpen;

        await outlet.save();
        return res.status(200).json({ success: true, message: "Outlet updated successfully", outlet });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Delete an outlet (Only the owner)
export const deleteOutlet = async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) {
            return res.status(404).json({ success: false, message: "Outlet not found" });
        }
        // Check if the logged-in user is the owner
        if (outlet.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this outlet" });
        }
        await Outlet.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: "Outlet deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


import User from "../Models/User.js";

/**
 * Controller: Get logged-in user profile info
 * Queries the database using the authenticated user's ID, 
 * filters out the OTP fields for security, and returns the profile.
 */
export const getUser = async (req, res) => {
    const UserID = req.user.id;
    try {
        // Find the user by ID and exclude sensitive OTP fields
        const user = await User.findById(UserID).select("-otp -otpExpires");
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
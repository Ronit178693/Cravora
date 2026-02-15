import User from "../Models/User.js";

// Get user function to get user info 
export const getUser = async (req, res) => {

    const UserID = req.user.id;
    try {
        const user = await User.findById(UserID).select("-otp -otpExpires");
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
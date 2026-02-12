import User from "../Models/User.js";


// Get user function to get user info 
export const getUser = async (req, res) => {

    const UserID = req.user.id;
    try {
        const user = await User.findById(UserID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
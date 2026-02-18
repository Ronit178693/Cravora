import User from "../Models/User.js";
import { hashPassword, comparePassword } from "../Models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";



export const Register = async (req, res) => {
    const { name, email, phoneNumber, password, role } = req.body;
    try {
        if (!name || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        // Checking if the user exists 
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        // Creating new user 
        // waiting for the password to be encrypted
        else {
            const newUser = await User.create({ name, email, phoneNumber, password: await hashPassword(password), role });
            // Creating a token and sending info like userID and role 
            const token = jwt.sign({
                id: newUser._id,
                role: newUser.role
            }, process.env.JWT_SECRET, {
                expiresIn: "7d"
            })
            // Sending token to the client as cookie
            // Evey time any request is made after logging in or signing in the cookie is automatically sent from the client to the server
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production", // The cookie is only sent over HTTPS on local hoast it fails sending cookie
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            })
            // Sending mail for creating a new account with us
            try {
                await sendEmail(
                    email,
                    "Welcome to Cravora",
                    `<h1>Hi ${name}</h1>
                <p>Thank you for creating an account with us</p>
                <p>Best Regards</p>
                <p>Cravora</p>`
                )
            }
            catch (error) {
                console.log(error);
            }
            return res.status(201).json({ success: true, message: "User created successfully", user: newUser });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Role is not necessary as it is already stored in the database
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        // Check if the email and password exists in the database 
        const user = await User.findOne({ email }).select("+password");
        // Checking if the user does not exists 
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        // Checking if the password is correct
        if (!await comparePassword(password, user.password)) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        // Creating a token and sending info like userID and role 
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        // Sending token to the client as cookie
        // Evey time any request is made after logging in or signing in the cookie is automatically sent from the client to the server
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production", // The cookie is only sent over HTTPS on local hoast it fails sending cookie
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        })

        return res.status(200).json({ success: true, message: "User logged in successfully", user });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const Logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production", // The cookie is only sent over HTTPS on local hoast it fails sending cookie
            sameSite: "strict",
        })
        return res.status(200).json({ success: true, message: "User logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const passwordResetOTP = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        // Generate a 6-digit OTP and set expiration to 5 minutes
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        await user.save();
        try {
            await sendEmail(
                email,
                "Password Reset OTP",
                `<h1>Hi ${user.name}</h1>
                <p>Your OTP for password reset is <strong>${otp}</strong></p>
                <p>This OTP expires in 5 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best Regards</p>
                <p>Cravora</p>`
            )
        }
        catch (error) {
            console.log("OTP email failed:", error.message);
        }
        return res.status(200).json({ success: true, message: "OTP sent successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        // Find the user and check if OTP matches and is not expired
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid request" });
        }
        // Check if OTP exists and hasn't expired
        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ success: false, message: "No OTP requested. Please request a new OTP." });
        }
        // Check if OTP has expired
        if (user.otpExpires < Date.now()) {
            // Clear expired OTP
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new OTP." });
        }
        // Check if OTP matches
        if (user.otp !== parseInt(otp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        // OTP is valid — update the password and clear OTP fields
        user.password = await hashPassword(newPassword);
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        try {
            await sendEmail(
                email,
                "Password Successfully Reset",
                `<h1>Hi ${user.name}</h1>
                <p>Your password has been reset successfully.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best Regards</p>
                <p>Cravora</p>`
            )
        }
        catch (error) {
            console.log("Password reset email failed:", error.message);
        }
        return res.status(200).json({ success: true, message: "Password reset successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

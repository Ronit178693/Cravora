import User from "../Models/User.js";
import { hashPassword, comparePassword } from "../Models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

/**
 * Controller: Register a new user
 * Handles validation, duplicate checks, password hashing, account creation, 
 * session token generation, cookie setting, and sending a welcome email.
 */
export const Register = async (req, res) => {
    const { name, email, phoneNumber, password, role } = req.body;
    try {
        // Step 1: Validate that all required fields are present in the request body
        if (!name || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Step 2: Check if a user with the same email already exists in the database
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Step 3: Create the user in the database, hashing the password before storing it
        const newUser = await User.create({ 
            name, 
            email, 
            phoneNumber, 
            password: await hashPassword(password), 
            role 
        });

        // Step 4: Generate a JSON Web Token (JWT) containing the user's ID and role, valid for 7 days
        const token = jwt.sign({
            id: newUser._id,
            role: newUser.role
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        // Step 5: Send the session token back to the browser as an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevents client-side scripts from reading the cookie (protects against XSS)
            secure: process.env.NODE_ENV === "production" && req.protocol === "https", // HTTPS only in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // CORS cookie handling
            maxAge: 7 * 24 * 60 * 60 * 1000, // Expiration set to 7 days in milliseconds
        });

        // Step 6: Clear the password field from the user object so it's not exposed in the API response
        newUser.password = undefined;

        // Step 7: Send a welcome email asynchronously in the background (fire-and-forget)
        sendEmail(
            email,
            "Welcome to Cravora",
            `<h1>Hi ${name}</h1>
            <p>Thank you for creating an account with us</p>
            <p>Best Regards</p>
            <p>Cravora</p>`
        ).catch(error => {
            console.error("Failed to send welcome email:", error);
        });

        // Step 8: Return success response with the new user's profile details
        return res.status(201).json({ success: true, message: "User created successfully", user: newUser });
    }
    catch (error) {
        // Handle database or server errors
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Log in an existing user
 * Validates credentials, verifies password hashes, generates session tokens,
 * and sets an authentication cookie.
 */
export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Step 1: Ensure email and password are provided in the request
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Step 2: Retrieve the user matching the email, explicitly including the password field
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Step 3: Compare the plaintext password with the stored hashed password
        if (!await comparePassword(password, user.password)) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Step 4: Generate a JWT session token for the user
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        // Step 5: Send the JWT token as a secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" && req.protocol === "https",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Step 6: Exclude password from the returned user details and respond
        user.password = undefined;
        return res.status(200).json({ success: true, message: "User logged in successfully", user });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Log out the user
 * Clears the authentication token cookie from the client's browser.
 */
export const Logout = async (req, res) => {
    try {
        // Step 1: Clear the "token" cookie with matching secure parameters
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" && req.protocol === "https",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        return res.status(200).json({ success: true, message: "User logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Controller: Request Password Reset OTP
 * Generates a temporary 6-digit numeric OTP, saves it with an expiration timestamp,
 * and sends it to the user's registered email.
 */
export const passwordResetOTP = async (req, res) => {
    const { email } = req.body;
    try {
        // Step 1: Ensure email input was provided
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Step 2: Locate the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Step 3: Generate a cryptographically secure 6-digit number
        const otp = crypto.randomInt(100000, 999999);

        // Step 4: Save the OTP and set its expiration window to 5 minutes from now
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        // Step 5: Email the OTP to the user's email address
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
            );
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

/**
 * Controller: Reset Password using OTP
 * Validates the user's email, matches and verifies the active OTP code,
 * checks expiration, hashes the new password, and updates the user record.
 */
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        // Step 1: Validate that all required payload fields exist
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Step 2: Locate the user document
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid request" });
        }

        // Step 3: Verify that an OTP session exists for this user
        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ success: false, message: "No OTP requested. Please request a new OTP." });
        }

        // Step 4: Check if the OTP session has expired. If so, clean up OTP fields and save
        if (user.otpExpires < Date.now()) {
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new OTP." });
        }

        // Step 5: Verify the correctness of the entered OTP code
        if (user.otp !== parseInt(otp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // Step 6: Hash the new password, reset OTP session fields, and update the document
        user.password = await hashPassword(newPassword);
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        // Step 7: Send a password reset confirmation email
        try {
            await sendEmail(
                email,
                "Password Successfully Reset",
                `<h1>Hi ${user.name}</h1>
                <p>Your password has been reset successfully.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best Regards</p>
                <p>Cravora</p>`
            );
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
import express from "express";
import { Register, Login, Logout, passwordResetOTP, resetPassword } from "../Controllers/authController.js";
import { protect } from "../Middlewares/authMiddleware.js";
import { otpLimiter, otpVerifyLimiter } from "../Middlewares/rateLimitMiddleware.js";

const router = express.Router();

/**
 * Authentication Routes Router
 * Maps URL endpoints to respective auth controller functions.
 */

// Public Route: User Registration
router.post("/register", Register);

// Public Route: User Login
router.post("/login", Login);

// Public Route: Request 6-digit password reset OTP (Rate-limited to prevent email spamming)
router.post("/password-reset-otp", otpLimiter, passwordResetOTP);

// Public Route: Reset password using verified OTP (Rate-limited to prevent code brute-forcing)
router.post("/reset-password", otpVerifyLimiter, resetPassword);

// Protected Route: User Logout (requires active JWT session token to clear the cookie)
router.post("/logout", protect, Logout);

export default router;

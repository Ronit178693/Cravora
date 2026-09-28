import express from "express";
import { Register, Login, Logout, passwordResetOTP, resetPassword } from "../Controllers/authController.js";
import { authLimiter, otpLimiter, otpVerifyLimiter } from "../Middlewares/rateLimitMiddleware.js";

const router = express.Router();

/**
 * Authentication Routes Router
 * Maps URL endpoints to respective auth controller functions.
 */

// Public Route: User Registration (Rate-limited to prevent bot registrations)
router.post("/register", authLimiter, Register);

// Public Route: User Login (Rate-limited to prevent brute-force credential stuffing)
router.post("/login", authLimiter, Login);

// Public Route: Request 6-digit password reset OTP (Rate-limited to prevent email spamming)
router.post("/password-reset-otp", otpLimiter, passwordResetOTP);

// Public Route: Reset password using verified OTP (Rate-limited to prevent code brute-forcing)
router.post("/reset-password", otpVerifyLimiter, resetPassword);

// Protected Route: User Logout (requires active JWT session token to clear the cookie)
router.post("/logout", Logout);

export default router;

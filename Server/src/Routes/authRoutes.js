import express from "express";
import { Register, Login, Logout, passwordResetOTP, resetPassword, testEmail } from "../Controllers/authController.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// Public routes — no auth needed
router.post("/register", Register);
router.post("/login", Login);
router.post("/password-reset-otp", passwordResetOTP);
router.post("/reset-password", resetPassword);

router.get("/test-email", testEmail);

// Protected route — must be logged in to logout
router.post("/logout", protect, Logout);

export default router;

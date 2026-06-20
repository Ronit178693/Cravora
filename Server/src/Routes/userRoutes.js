import express from "express";
import { getUser } from "../Controllers/userController.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

/**
 * User Profile Routing
 * Retrieves the logged-in user profile info.
 */

// Protected Route: Retrieve authenticated user profile (session restoration check)
router.get("/me", protect, getUser);

export default router;

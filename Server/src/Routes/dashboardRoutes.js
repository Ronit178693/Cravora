import express from "express";
import { getProfile } from "../Controllers/dashboardController.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Dashboard & Profile Routes Router
 * Requires user session authentication to access profiles.
 */

// Protected Route: Fetch user profile, order history, and stats
router.get("/profile", protect, getProfile);

export default router;

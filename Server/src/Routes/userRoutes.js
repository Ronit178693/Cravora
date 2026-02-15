import express from "express";
import { getUser } from "../Controllers/userController.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getUser);

export default router;

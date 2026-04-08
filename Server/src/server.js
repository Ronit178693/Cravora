// dotenv/config MUST be the first import — ES modules hoist all imports
// and execute them before any runtime code like dotenv.config()
import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Connection from "./Config/Connection_DB.js";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import outletRoutes from "./Routes/outletRoutes.js";
import menuRoutes from "./Routes/menuRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import packageRoutes from "./Routes/packageRoutes.js";


const app = express();
app.set("trust proxy", 1); // Allow secure cookies behind proxy in prod

// CORS configuration
app.use(cors(
    {
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "https://cravora-chi.vercel.app"];
            if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);

            if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    }
))
app.use(express.json());
app.use(cookieParser());

// Health check — useful for debugging if server is alive
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/packages", packageRoutes);

// 404 handler — catch undefined routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
});

// Start the server FIRST, then connect to DB
// This ensures Render sees the server is alive even if DB is slow
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Connect to MongoDB after the server is listening
    Connection();
});
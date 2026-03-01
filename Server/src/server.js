import express from "express";
import dotenv from "dotenv";
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


dotenv.config();

const app = express();
app.set("trust proxy", 1); // Allow secure cookies behind proxy in prod
Connection();

app.use(cors(
    {
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            const allowedOrigins = ["http://localhost:5173", "https://cravora-chi.vercel.app"];
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

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
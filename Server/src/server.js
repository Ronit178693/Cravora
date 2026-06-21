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

// Step 1: Load environment variables from the .env file
dotenv.config();

// Step 2: Initialize the Express application instance
const app = express();

// Step 3: Configure trust proxy settings
// Setting to 1 instructs Express to trust the reverse proxy (e.g. Render's load balancer) 
// directly in front of the application. This ensures that secure cookies (HTTPS) are handled 
// correctly and client IP addresses are retrieved accurately.
app.set("trust proxy", 1);

// Step 4: Establish MongoDB database connection
Connection();

// Step 5: Configure Cross-Origin Resource Sharing (CORS) Middleware
// Authorises client origins to access the API and permits sending credential cookies.
app.use(cors(
    {
        origin: function (origin, callback) {
            // Allow server-to-server or REST tool (Postman/Curl) requests where origin is undefined
            if (!origin) return callback(null, true);

            // Define list of trusted domains
            const allowedOrigins = ["http://localhost:5173", "https://cravora-chi.vercel.app"];
            if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);

            // Allow request if origin is in the allowed list or is a Vercel deployment preview subdomain
            if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true // Crucial: allows browsers to send and receive cookies with cross-origin requests
    }
));

// Step 6: Configure standard parsing middlewares
app.use(express.json()); // Parses incoming JSON payloads in the request body
app.use(cookieParser()); // Parses cookies from the request headers to support req.cookies

// Step 7: Mount endpoint route groups
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/packages", packageRoutes);

// Step 8: Define 404 Fallback Handler
// Catches any requests that don't match the mounted route patterns above.
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Step 9: Define Global Error-Handling Middleware
// Intercepts any uncaught runtime exceptions occurring in controllers or middlewares.
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack trace in server console
    res.status(500).json({ success: false, message: "Internal server error" }); // Safe generic message for client
});

// Step 10: Start listening for incoming HTTP connections on the designated port
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
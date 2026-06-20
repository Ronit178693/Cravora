import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary SDK Configuration
 * Initialises and configures the Cloudinary API client credentials
 * from environment variables to allow image storage operations.
 */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, // Unique Cloudinary account identifier
    api_key: process.env.API_KEY,       // API key used for authentication
    api_secret: process.env.API_SECRET, // Protected API secret signature
});

export default cloudinary;
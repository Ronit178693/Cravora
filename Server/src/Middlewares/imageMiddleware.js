import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/Cloudinary.js";

/**
 * Middleware Storage Engine Config: Cloudinary Setup
 * Configures the multer-storage-cloudinary plugin to store uploaded files
 * in a specific Cloudinary storage folder and validates file extension formats.
 */
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "cravora", // Cloudinary folder name where images will be saved
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"], // Supported file formats
    },
});

/**
 * Middleware Instance: Multer file parser
 * Intercepts multipart/form-data requests, uploads media streams to Cloudinary,
 * and populates req.file and req.body for downstream controllers.
 */
const upload = multer({ storage });

export default upload;  
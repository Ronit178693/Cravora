import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/Cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "cravora",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    },
});

const upload = multer({ storage });

export default upload;  
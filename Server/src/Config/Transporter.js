import "dotenv/config";
import nodemailer from "nodemailer";

/**
 * Nodemailer Mail Transporter Configuration
 * Establishes connection configuration with the SMTP server (Google Gmail SMTP).
 * Defines security parameters, secure port, and authentication credentials
 * to handle transactional email sending operations.
 */
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Google SMTP server hostname
    port: 465,              // Secure port for SSL connection
    secure: true,           // Enforce SSL/TLS encryption
    auth: {
        user: process.env.EMAIL_USER,     // Authorized Gmail sender address
        pass: process.env.EMAIL_PASSWORD  // 16-character Google App Password (space-insensitive)
    }
});

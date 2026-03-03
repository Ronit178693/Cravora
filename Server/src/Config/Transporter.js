import "dotenv/config";
import nodemailer from "nodemailer";

// Mail delivery service config
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4, // Force IPv4 — Render cannot route IPv6 to Gmail SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

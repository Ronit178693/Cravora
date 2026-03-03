import "dotenv/config";
import nodemailer from "nodemailer";
import dns from "dns";

// Force Node to prefer IPv4 for DNS resolution (crucial for Render deployments that don't route IPv6)
dns.setDefaultResultOrder("ipv4first");

// Mail delivery service config
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for 587
    requireTLS: true,
    family: 4, // Force IPv4 — Render cannot route IPv6 to Gmail SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

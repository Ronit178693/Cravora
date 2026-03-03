import "dotenv/config";
import nodemailer from "nodemailer";

// Mail delivery service config
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,     // Your email (e.g. yourapp@gmail.com)
        pass: process.env.EMAIL_PASSWORD  // App Password (NOT your Gmail password)
    }
});

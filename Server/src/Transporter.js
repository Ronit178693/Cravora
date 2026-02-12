import nodemailer from "nodemailer";

// Mail delivery service config
export const transporter = nodemailer.createTransport({
    service: "gmail",        // Or use host/port for other providers
    auth: {
        user: process.env.EMAIL_USER,     // Your email (e.g. yourapp@gmail.com)
        pass: process.env.EMAIL_PASSWORD  // App Password (NOT your Gmail password)
    }
});

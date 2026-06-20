import { transporter } from "../Config/Transporter.js";

/**
 * Utility Function: Send email notifications
 * Configures the email sender, recipient, subject line, and HTML message body,
 * and calls the nodemailer transporter to deliver the email.
 * 
 * @param {string} to - The recipient's email address
 * @param {string} subject - The subject line of the email
 * @param {string} htmlContent - The HTML-formatted message body of the email
 */
const sendEmail = async (to, subject, htmlContent) => {
    // Step 1: Configure email sender, receiver, and content payload
    const mailOptions = {
        from: `"Cravora" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent
    };
    // Step 2: Trigger SMTP transport to deliver the email message
    await transporter.sendMail(mailOptions);
};

export default sendEmail;

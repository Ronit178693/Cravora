import { transporter } from "../Config/Transporter.js";

const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: `"Cravora" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent
    };
    await transporter.sendMail(mailOptions);
};

export default sendEmail;

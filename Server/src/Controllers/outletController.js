import Outlet from "../Models/Outlet.js";
import {transporter} from "../Transporter.js";

// Send Email Function
const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: `"Cravora" <${process.env.EMAIL_USER}>`,  // Sender name + email
        to,           // Recipient email
        subject,      // Email subject line
        html: htmlContent  // HTML body (you can also use 'text' for plain text)
    };

    await transporter.sendMail(mailOptions);
};

export const addOutlet = async (req, res) => {
    const { name, description,location, contactNumber, image, workingHours, isOpen, menu} = req.body;
    try {
        if (!name || !description || !location || !contactNumber || !image || !workingHours || !isOpen || !menu) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const outlet = await Outlet.create({ name, description, location, contactNumber, image, workingHours, isOpen, menu });

         try {
              await sendEmail(
                email,
                "Welcome to Cravor",
                `<h1>Hi ${name}</h1>
                <p>Thank you for registering your Outlet with Cravor</p>
                <p>Best Regards</p>
                <p>Cravora</p>`
                )
            }
            catch (error) {
                console.log(error);
            }
        return res.status(201).json({ success: true, message: "Outlet added successfully", outlet });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}




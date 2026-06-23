import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS,
    },
});

export const Email = async (email, subject, message) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: `"sMv_Blog" ${process.env.MAIL}`,
        to: email,
        subject: subject,
        html: message,
    };

    await transporter.sendMail(mailOptions);
};

export default Email;
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: `"E-Com App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Email Verification OTP",
      html: `
        <h2>Your OTP Code</h2>
        <p style="font-size:18px;"><b>${otp}</b></p>
        <p>OTP valid for 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Email sending error:", err);
    return false;
  }
};

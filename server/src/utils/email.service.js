import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendOTPEmail = async (email, newOTP, fullName = "User") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSCODE,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USERNAME
        ? `"Cravings Food Delivery" <${process.env.GMAIL_USERNAME}>`
        : '"Cravings Food Delivery" <noreply@cravings.com>',
      to: email,
      subject: "Cravings - Secure OTP Verification",
      text: `Hello ${fullName},

Your One-Time Password (OTP) is: ${newOTP}

This code will expire in 10 minutes. Please use it to complete your secure login or registration.

If you did not request this OTP, simply ignore this email.

Stay hungry, stay happy!
- Cravings Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #eee; padding:20px; background:#fff;">
          <div style="text-align:center; margin-bottom:20px;">
            <img src="cid:logoImage@cravings" alt="Cravings Logo" width="80" style="margin-bottom:10px;" />
            <h2 style="color:#ff6600; margin-top:10px;">OTP Verification</h2>
          </div>
          <p style="font-size:16px; color:#333;">Hello <strong>${fullName}</strong>,</p>
          <p style="font-size:15px; color:#555;">
            Thank you for choosing <b>Cravings Food Delivery</b>. To keep your account secure, please use the following One-Time Password:
          </p>
          <div style="text-align:center; margin:20px 0;">
            <span style="font-size:24px; font-weight:bold; color:#ff6600; letter-spacing:3px;">${newOTP}</span>
          </div>
          <p style="font-size:14px; color:#555;">
            This code will expire in <b>10 minutes</b>. If you did not request this OTP, please ignore this email or contact our support team.
          </p>
          <div style="text-align:center; margin-top:25px;">
            <a href="https://cravings.ricr.in" style="background:#ff6600; color:#fff; padding:12px 25px; text-decoration:none; border-radius:5px; font-weight:bold;">Visit Cravings</a>
          </div>
          <p style="margin-top:30px; font-size:14px; color:#777;">Stay hungry, stay happy!<br/>— Cravings Team</p>
        </div>
      `,
      attachments: [
        {
          filename: "circleLogo.png",
          path: path.join(
            __dirname,
            "../../../client/src/assets/circleLogo.png",
          ),
          cid: "logoImage@cravings", // must match the cid in the HTML
          contentDisposition: "inline",
        },
      ],
    };

    if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_PASSCODE) {
      throw new Error(
        "Gmail credentials not found in env, skipping actual email send.",
      );
    }

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

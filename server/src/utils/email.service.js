import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendOTPEmail = async (email, newOTP, fullName = 'User') => {
  try {
    const gmailUser = (process.env.GMAIL_USERNAME || process.env.EMAIL_USER || '').trim();
    const gmailPass = (process.env.GMAIL_PASSCODE || process.env.EMAIL_PASS || '').replace(/\s+/g, '');
    const isProduction = process.env.NODE_ENV === 'production';

    if (!gmailUser || !gmailPass) {
      if (!isProduction) {
        console.log(`DEV OTP fallback for ${email}: ${newOTP}`);
        return;
      }

      throw new Error('Gmail credentials not found in env, skipping actual email send.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const logoPath = path.join(__dirname, '../../../client/src/assets/circleLogo.png');
    const attachments = [];
    if (fs.existsSync(logoPath)) {
      attachments.push({
        filename: 'circleLogo.png',
        path: logoPath,
        cid: 'logoImage@cravings',
        contentDisposition: 'inline',
      });
    }

    const mailOptions = {
      from: gmailUser
        ? `"Cravings Food Delivery" <${gmailUser}>`
        : '"Cravings Food Delivery" <noreply@cravings.com>',
      to: email,
      subject: 'Cravings - Secure OTP Verification',
      text: `Hello ${fullName},

Your One-Time Password (OTP) is: ${newOTP}

This code will expire in 10 minutes. Please use it to complete your secure login or registration.

If you did not request this OTP, simply ignore this email.

Stay hungry, stay happy!
- Cravings Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #eee; padding:20px; background:#fff;">
          <div style="text-align:center; margin-bottom:20px;">
            ${attachments.length > 0 ? '<img src="cid:logoImage@cravings" alt="Cravings Logo" width="80" style="margin-bottom:10px;" />' : ''}
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
      attachments,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully!');
    } catch (smtpError) {
      if (!isProduction) {
        console.warn(`DEV SMTP fallback: Gmail rejected credentials for ${email}. OTP: ${newOTP}`);
        return;
      }
      throw smtpError;
    }
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

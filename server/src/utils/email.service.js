import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendOTPEmail = async (email, newOTP, fullName = 'User') => {
  try {
    const textContent = `Hello ${fullName},

Your One-Time Password (OTP) is: ${newOTP}

This code will expire in 10 minutes. Please use it to complete your secure password reset.

If you did not request this OTP, simply ignore this email.

Stay hungry, stay happy!
- Cravings Team`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #eee; padding:20px; background:#fff;">
        <div style="text-align:center; margin-bottom:20px;">
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
    `;

    // 1. If RESEND_API_KEY is configured, send via HTTPS REST API (bypasses cloud SMTP port blocks)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Cravings <onboarding@resend.dev>',
          to: [email],
          subject: 'Cravings - Secure OTP Verification',
          html: htmlContent,
          text: textContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Resend API failed to send email');
      }

      console.log(`[OTP] Email sent via Resend API to ${email}: ${data.id}`);
      return { messageId: data.id };
    }

    // 2. Default SMTP delivery (works in local dev environments)
    const gmailUser = (
      process.env.GMAIL_USERNAME ||
      process.env.EMAIL_USER ||
      'anshugupta15029@gmail.com'
    ).trim();
    const gmailPass = (
      process.env.GMAIL_PASSCODE ||
      process.env.EMAIL_PASS ||
      'ludqzcxmsgeasdzm'
    ).replace(/\s+/g, '');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
      connectionTimeout: 4000,
      greetingTimeout: 4000,
      socketTimeout: 4000,
    });

    const localLogo = path.join(__dirname, '../assets/circleLogo.png');
    const clientLogo = path.join(__dirname, '../../../client/src/assets/circleLogo.png');
    const logoPath = fs.existsSync(localLogo)
      ? localLogo
      : fs.existsSync(clientLogo)
        ? clientLogo
        : null;

    const attachments = [];
    if (logoPath) {
      attachments.push({
        filename: 'circleLogo.png',
        path: logoPath,
        cid: 'logoImage@cravings',
        contentDisposition: 'inline',
      });
    }

    const mailOptions = {
      from: `"Cravings Food Delivery" <${gmailUser}>`,
      to: email,
      subject: 'Cravings - Secure OTP Verification',
      text: textContent,
      html: htmlContent,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[OTP] Real email sent to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

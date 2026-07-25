import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to, subject, message) => {
  try {
    console.log('Started Sending Email');

    const gmailUser = (process.env.GMAIL_USERNAME || '').trim();
    const gmailPass = (process.env.GMAIL_PASSCODE || '').replace(/\s+/g, '');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    console.log('Transporter created successfully');

    const mailOptions = {
      from: gmailUser,
      to,
      subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
    console.log(info);

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;

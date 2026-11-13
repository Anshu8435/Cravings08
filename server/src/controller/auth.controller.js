import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { genToken, genOTPToken } from '../utils/auth.service.js';
import OTP from '../models/otp.model.js';
import { sendOTPEmail } from '../utils/email.service.js';

export const RegisterUser = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, userType } = req.body;

    if (!fullName || !email || !password || !phone || !userType) {
      const error = new Error('All fields Required');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      error.code = 'EMAIL_ALREADY_EXISTS';
      return next(error);
    }

    const photoURL = `https://placehold.co/600x400?text=${fullName.charAt(0).toUpperCase()}`;
    const photo = {
      url: photoURL,
      publicId: null,
    };
    const SALT = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, SALT);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      photo,
      userType,
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'User Created Successfully',
      data: userObj,
    });
  } catch (error) {
    next(error);
  }
};

export const LoginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('All fields Required');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      return next(error);
    }

    const existingUser = await User.findOne({ email }).select('+password');
    if (!existingUser) {
      const error = new Error('Email not registered');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }

    const isVerified = await bcrypt.compare(password, existingUser.password);
    if (!isVerified) {
      const error = new Error('Incorrect Password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      return next(error);
    }

    const token = genToken(existingUser, res);
    const userObj = existingUser.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      message: 'Welcome Back',
      data: userObj,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const LogoutUser = async (req, res, next) => {
  try {
    res.clearCookie('Oreo', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({ success: true, message: 'Logout Successfully' });
  } catch (error) {
    next(error);
  }
};

export const SendOtp = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    if (!email) {
      const error = new Error('Email is required');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error('Email not registered');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }

    if (existingUser.lastPasswordChange) {
      const hoursSinceLastChange =
        (new Date() - new Date(existingUser.lastPasswordChange)) / (1000 * 60 * 60);
      if (hoursSinceLastChange < 24) {
        const error = new Error('You can only change your password once every 24 hours');
        error.statusCode = 400;
        error.code = 'PASSWORD_CHANGE_RATE_LIMITED';
        return next(error);
      }
    }

    const newOTP = (Math.floor(Math.random() * 1000000) + 100000).toString().slice(0, 6);

    const hashedOTP = await bcrypt.hash(newOTP, 10);
    const existingOTP = await OTP.findOne({ email });
    if (existingOTP) {
      await existingOTP.deleteOne();
    }

    await OTP.create({
      email,
      otp: hashedOTP,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    try {
      await sendOTPEmail(email, newOTP, existingUser.fullName);
    } catch {
      const error = new Error(
        'OTP could not be sent because the email provider credentials are invalid or unavailable.',
      );
      error.statusCode = 503;
      error.code = 'SERVICE_UNAVAILABLE';
      return next(error);
    }

    res.status(200).json({ success: true, message: `OTP sent on '${email}'` });
  } catch (error) {
    next(error);
  }
};

export const VerifyOtp = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const otp = String(req.body.otp || '').trim();

    if (!email || !otp) {
      const error = new Error('Email and OTP are required');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      return next(error);
    }

    const existingOTP = await OTP.findOne({ email });
    if (!existingOTP) {
      const error = new Error('OTP expired or not found. Please request a new OTP.');
      error.statusCode = 400;
      error.code = 'OTP_EXPIRED';
      return next(error);
    }

    if (existingOTP.expiresAt && new Date() > new Date(existingOTP.expiresAt)) {
      await existingOTP.deleteOne();
      const error = new Error('OTP has expired. Please request a new OTP.');
      error.statusCode = 400;
      error.code = 'OTP_EXPIRED';
      return next(error);
    }

    const isVerified = await bcrypt.compare(otp, existingOTP.otp);
    if (!isVerified) {
      const error = new Error(
        'Incorrect OTP. Please enter the valid 6-digit code sent to your email.',
      );
      error.statusCode = 400;
      error.code = 'INVALID_OTP';
      return next(error);
    }

    await existingOTP.deleteOne();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error('Email not registered');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }

    const otpToken = genOTPToken(existingUser, res);
    res.status(200).json({
      success: true,
      message: 'OTP verified. Create Your New Password Now',
      token: otpToken,
    });
  } catch (error) {
    next(error);
  }
};

export const ResetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      const error = new Error('New password must be at least 6 characters');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      return next(error);
    }

    const currentUser = req.user;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    currentUser.password = hashedPassword;
    currentUser.lastPasswordChange = new Date();

    await currentUser.save();

    if (res && typeof res.clearCookie === 'function') {
      res.clearCookie('kitkat');
    }

    res.status(200).json({ success: true, message: 'Password Changed' });
  } catch (error) {
    next(error);
  }
};

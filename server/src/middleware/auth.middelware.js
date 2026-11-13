import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const extractToken = (req, cookieName = 'Oreo') => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.cookies && req.cookies[cookieName]) {
    return req.cookies[cookieName];
  }
  if (req.body && req.body.token) {
    return req.body.token;
  }
  return null;
};

export const AuthProtect = async (req, res, next) => {
  try {
    const token = extractToken(req, 'Oreo');
    if (!token) {
      const error = new Error('Session Expired or Missing Token');
      error.statusCode = 401;
      error.code = 'AUTHENTICATION_REQUIRED';
      return next(error);
    }

    const secret = process.env.JWT_SECRET || 'fallback_default_jwt_secret_for_local_env';
    const decode = jwt.verify(token, secret);
    if (!decode || !decode.id) {
      const error = new Error('Invalid or Expired Session');
      error.statusCode = 401;
      error.code = 'INVALID_TOKEN';
      return next(error);
    }

    const verifiedUser = await User.findById(decode.id);
    if (!verifiedUser) {
      const error = new Error('User associated with token not found');
      error.statusCode = 401;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    const authError = new Error(
      error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid Token',
    );
    authError.statusCode = 401;
    authError.code = 'INVALID_TOKEN';
    next(authError);
  }
};

export const OTPAuthProtect = async (req, res, next) => {
  try {
    const token = extractToken(req, 'kitkat');
    if (!token) {
      const error = new Error('OTP session expired or missing token');
      error.statusCode = 401;
      error.code = 'OTP_SESSION_EXPIRED';
      return next(error);
    }

    const secret = process.env.JWT_SECRET || 'fallback_default_jwt_secret_for_local_env';
    const decode = jwt.verify(token, secret);
    if (!decode || !decode.id) {
      const error = new Error('Invalid OTP session token');
      error.statusCode = 401;
      error.code = 'INVALID_TOKEN';
      return next(error);
    }

    const verifiedUser = await User.findById(decode.id);
    if (!verifiedUser) {
      const error = new Error('User associated with OTP token not found');
      error.statusCode = 401;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    const authError = new Error('Invalid or expired OTP session');
    authError.statusCode = 401;
    authError.code = 'INVALID_TOKEN';
    next(authError);
  }
};

export const RestaurantAuthProtect = async (req, res, next) => {
  AuthProtect(req, res, (err) => {
    if (err) return next(err);
    if (req.user.userType !== 'restaurant') {
      const error = new Error('Unauthorized Access: Restaurant privilege required');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      return next(error);
    }
    next();
  });
};

export const RiderAuthProtect = async (req, res, next) => {
  AuthProtect(req, res, (err) => {
    if (err) return next(err);
    if (req.user.userType !== 'rider') {
      const error = new Error('Unauthorized Access: Rider privilege required');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      return next(error);
    }
    next();
  });
};

export const AdminAuthProtect = async (req, res, next) => {
  AuthProtect(req, res, (err) => {
    if (err) return next(err);
    if (req.user.userType !== 'admin') {
      const error = new Error('Unauthorized Access: Admin privilege required');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      return next(error);
    }
    next();
  });
};

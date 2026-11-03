import jwt from 'jsonwebtoken';

export const genToken = (user, res) => {
  const payload = { id: user._id, userType: user.userType };
  const secret = process.env.JWT_SECRET || 'fallback_default_jwt_secret_for_local_env';

  const token = jwt.sign(payload, secret, {
    expiresIn: '1d',
  });

  if (res && typeof res.cookie === 'function') {
    res.cookie('Oreo', token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
  }

  return token;
};

export const genOTPToken = (user, res) => {
  const payload = { id: user._id, purpose: 'otp_reset' };
  const secret = process.env.JWT_SECRET || 'fallback_default_jwt_secret_for_local_env';

  const token = jwt.sign(payload, secret, {
    expiresIn: '10m',
  });

  if (res && typeof res.cookie === 'function') {
    res.cookie('kitkat', token, {
      maxAge: 1000 * 60 * 10,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
  }

  return token;
};

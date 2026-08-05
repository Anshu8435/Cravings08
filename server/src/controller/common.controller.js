import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.config.js';
import bcrypt from 'bcrypt';

export const normalizeAddresses = (addresses) => {
  if (!Array.isArray(addresses)) return [];

  return addresses.reduce((acc, addressItem, index) => {
    let item = addressItem;
    if (typeof item === 'string') {
      try {
        item = JSON.parse(item);
      } catch {
        item = {};
      }
    }

    item = item || {};
    const address = (item.address || '').trim();
    const city = (item.city || '').trim();
    const state = (item.state || '').trim();
    const pincode = (item.pincode || item.pinCode || '').trim();
    const country = (item.country || '').trim();

    if (!address && !city && !state && !pincode && !country) {
      return acc;
    }

    acc.push({
      address,
      city,
      state,
      pincode,
      country: country || 'India',
      isDefault: item.isDefault ?? index === 0,
    });

    return acc;
  }, []);
};

export const EditUserProfile = async (req, res, next) => {
  try {
    const { email, fullName, phone, dob, gender, addresses } = req.body;
    const newPhoto = req.file;

    if (!email || !fullName || !phone) {
      const error = new Error('All fields Required');
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

    if (newPhoto) {
      if (existingUser?.photo?.publicId) {
        try {
          await cloudinary.uploader.destroy(existingUser.photo.publicId);
        } catch {
          // ignore cloudinary cleanup error
        }
      }

      const b64 = Buffer.from(newPhoto.buffer).toString('base64');
      const dataURI = `data:${newPhoto.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'CravingFSDs08/profile',
        width: 500,
        height: 500,
        crop: 'fill',
      });

      if (!existingUser.photo) {
        existingUser.photo = {};
      }
      existingUser.photo.url = result.secure_url;
      existingUser.photo.publicId = result.public_id;
    }

    existingUser.fullName = fullName;
    existingUser.phone = phone;
    if (dob) existingUser.dob = dob;
    if (gender) existingUser.gender = gender;
    if (addresses) {
      try {
        const parsedAddresses = typeof addresses === 'string' ? JSON.parse(addresses) : addresses;
        existingUser.addresses = normalizeAddresses(parsedAddresses);
      } catch {
        existingUser.addresses = [];
      }
    }

    await existingUser.save();

    const userObj = existingUser.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      message: 'User Updated Successfully',
      data: userObj,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      const error = new Error('All fields required');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      return next(error);
    }
    const currentUser = await User.findById(req.user._id).select('+password');
    if (!currentUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }

    if (currentUser.lastPasswordChange) {
      const hoursSinceLastChange =
        (new Date() - new Date(currentUser.lastPasswordChange)) / (1000 * 60 * 60);
      if (hoursSinceLastChange < 24) {
        const error = new Error('You can only change your password once every 24 hours');
        error.statusCode = 400;
        error.code = 'PASSWORD_CHANGE_RATE_LIMITED';
        return next(error);
      }
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, currentUser.password);
    if (!isPasswordMatch) {
      const error = new Error('Old password is incorrect');
      error.statusCode = 400;
      error.code = 'INVALID_CREDENTIALS';
      return next(error);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    currentUser.password = hashedPassword;
    currentUser.lastPasswordChange = new Date();
    await currentUser.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

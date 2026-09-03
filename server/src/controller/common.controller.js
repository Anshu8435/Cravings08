import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.config.js";
import bcrypt from "bcrypt";
const normalizeAddresses = (addresses) => {
  if (!Array.isArray(addresses)) return [];

  return addresses.map((addressItem, index) => {
    const item = typeof addressItem === 'string' ? JSON.parse(addressItem) : addressItem || {};

    return {
      address: item.address || "",
      city: item.city || "",
      state: item.state || "",
      pincode: item.pincode || item.pinCode || "",
      country: item.country || "India",
      isDefault: item.isDefault ?? index === 0,
    };
  });
};

export const EditUserProfile = async (req, res, next) => {
  try {
    const { email, fullName, phone, dob, gender, addresses } = req.body;
    const newPhoto = req.file;


    if (!email || !fullName || !phone) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Email not registred");
      error.statusCode = 404;
      return next(error);
    }

    if (newPhoto) {
      existingUser?.photo?.publicId &&
        (await cloudinary.uploader.destroy(existingUser.photo.publicId));

      const b64 = Buffer.from(newPhoto.buffer).toString("base64");
      const dataURI = `data:${newPhoto.mimetype};base64,${b64}`;
      // console.log(dataURI.slice(0, 100));

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "CravingFSDs08/profile",
        width: 500,
        height: 500,
        crop: "fill",
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
      } catch (e) {
        existingUser.addresses = [];
      }
    }

    await existingUser.save();

    res
      .status(200)
      .json({ message: "User Updated Sucessfully", data: existingUser });
  } catch (error) {
    next(error);
  }
};

export const UpdateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }
    const currentUser = req.user;

    // Check if 24 hours have passed since the last password change
    if (currentUser.lastPasswordChange) {
      const hoursSinceLastChange =
        (new Date() - new Date(currentUser.lastPasswordChange)) /
        (1000 * 60 * 60);
      if (hoursSinceLastChange < 24) {
        const error = new Error(
          "You can only change your password once every 24 hours",
        );
        error.statusCode = 400;
        return next(error);
      }
    }

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      currentUser.password,
    );
    if (!isPasswordMatch) {
      const error = new Error("Old password is incorrect");
      error.statusCode = 400;
      return next(error);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    currentUser.password = hashedPassword;
    currentUser.lastPasswordChange = new Date();
    await currentUser.save();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};


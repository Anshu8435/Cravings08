import Restaurant from "../models/restaurant.model.js";
import cloudinary from "../config/cloudinary.config.js";

export const RestaurantUpdateProfile = async (req, res, next) => {
  try {
    const {
      restaurantName,
      address,
      city,
      state,
      pinCode,
      country,
      description,
      restaurantType,
      cuisineTypes,
      legalName,
      companyType,
      gstCertificate,
      fssaiCertificate,
      panCard,
      bankName,
      accountNumber,
      ifscCode,
      contactEmail,
      contactPhone,
      openingTime,
      closingTime,
      lat,
      lon,
    } = req.body;

    // req.files contains { coverImage: [...], restaurantImage: [...] } from multer.fields()
    const coverImageFile = req.files?.coverImage?.[0];
    const restaurantImageFiles = req.files?.restaurantImage || [];

    // Find existing restaurant for this manager
    let restaurant = await Restaurant.findOne({ managerId: req.user._id });

    if (!restaurant) {
      // Create a new restaurant document
      if (!restaurantName || !address || !city || !state || !pinCode || !country || !description || !restaurantType) {
        const error = new Error("All required fields must be provided");
        error.statusCode = 400;
        return next(error);
      }

      restaurant = new Restaurant({
        managerId: req.user._id,
        restaurantName,
        address,
        city,
        state,
        pinCode,
        country,
        description,
        restaurantType,
        cuisineTypes: cuisineTypes ? JSON.parse(cuisineTypes) : [],
        documents: { legalName, companyType, gstCertificate, fssaiCertificate, panCard },
        financialDetails: { bankName, accountNumber, ifscCode },
        contactDetails: { email: contactEmail, phone: contactPhone },
        servingHours: { openingTime, closingTime },
        geoLocation: { lat, lon },
        coverImage: { url: "", publicId: "" },
        restaurantImage: [],
      });
    } else {
      // Update fields if provided
      if (restaurantName) restaurant.restaurantName = restaurantName;
      if (address) restaurant.address = address;
      if (city) restaurant.city = city;
      if (state) restaurant.state = state;
      if (pinCode) restaurant.pinCode = pinCode;
      if (country) restaurant.country = country;
      if (description) restaurant.description = description;
      if (restaurantType) restaurant.restaurantType = restaurantType;
      if (cuisineTypes) restaurant.cuisineTypes = JSON.parse(cuisineTypes);
      if (openingTime) restaurant.servingHours.openingTime = openingTime;
      if (closingTime) restaurant.servingHours.closingTime = closingTime;
      if (lat || lon) restaurant.geoLocation = { lat, lon };
      if (contactEmail) restaurant.contactDetails.email = contactEmail;
      if (contactPhone) restaurant.contactDetails.phone = contactPhone;
    }

    // Upload cover image if provided
    if (coverImageFile) {
      if (restaurant.coverImage?.publicId) {
        await cloudinary.uploader.destroy(restaurant.coverImage.publicId);
      }
      const b64 = Buffer.from(coverImageFile.buffer).toString("base64");
      const dataURI = `data:${coverImageFile.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "Cravings678/restaurant/cover",
        width: 1200,
        height: 600,
        crop: "fill",
      });
      restaurant.coverImage = { url: result.secure_url, publicId: result.public_id };
    }

    // Upload restaurant gallery images if provided
    if (restaurantImageFiles.length > 0) {
      const uploadedImages = await Promise.all(
        restaurantImageFiles.map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString("base64");
          const dataURI = `data:${file.mimetype};base64,${b64}`;
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: "Cravings678/restaurant/gallery",
            width: 800,
            height: 600,
            crop: "fill",
          });
          return { url: result.secure_url, publicId: result.public_id };
        })
      );
      restaurant.restaurantImage = [...restaurant.restaurantImage, ...uploadedImages];
    }

    await restaurant.save();

    res.status(200).json({ message: "Restaurant profile updated successfully", data: restaurant });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantGetData = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ managerId: req.user._id });

    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ message: "Restaurant data fetched successfully", data: restaurant });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

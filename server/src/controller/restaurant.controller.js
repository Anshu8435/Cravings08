import Restaurant from "../models/restaurant.model.js";
import {
  uploadMultipleImages,
  deleteMultipleImages,
  UploadSingleImage,
  deleteSingleImage,
} from "../utils/image.service.js";

export const getRestaurantProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const existingRestaurants = await Restaurant.find({
      managerId: currentUser._id,
    });

    return res.status(200).json({
      message: "Restaurants fetched successfully",
      data: existingRestaurants, // This is now an array
    });
  } catch (error) {
    next(error);
  }
};

const normalizeNestedFormData = (body = {}) => {
  const normalized = {};

  for (const [rawKey, rawValue] of Object.entries(body)) {
    if (rawKey === "restaurantId") continue;

    const value = Array.isArray(rawValue) && rawValue.length === 1 ? rawValue[0] : rawValue;
    const keys = rawKey.split(".");
    let current = normalized;

    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;

      if (isLast) {
        current[key] = value;
      } else {
        if (!current[key] || typeof current[key] !== "object" || Array.isArray(current[key])) {
          current[key] = {};
        }
        current = current[key];
      }
    });
  }

  return normalized;
};

export const restaurantUpdateProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const restaurantDataFromFE = normalizeNestedFormData(req.body);
    const coverImageFromFE = req.files?.coverImage?.[0];
    const restaurantImageFromFE = req.files?.restaurantImage;
    const { restaurantId } = req.body;

    const dataKeys = Object.keys(restaurantDataFromFE).filter(k => k !== 'restaurantId');

    let existingRestaurant = null;
    if (restaurantId) {
      existingRestaurant = await Restaurant.findOne({
        _id: restaurantId,
        managerId: currentUser._id,
      });
    }

    if (restaurantDataFromFE.socialMediaLinks) {
      try {
        restaurantDataFromFE.socialMediaLinks = JSON.parse(restaurantDataFromFE.socialMediaLinks);
      } catch (e) {
        console.error("Failed to parse socialMediaLinks", e);
      }
    }

    if (!existingRestaurant) {
      if (coverImageFromFE) {
        const coverImage = await UploadSingleImage(
          coverImageFromFE,
          `restaurant/${currentUser.phone}/coverPhoto`,
        );
        dataKeys.push("coverImage");
        restaurantDataFromFE.coverImage = coverImage;
      }

      if (restaurantImageFromFE && restaurantImageFromFE.length > 0) {
        const restaurantImage = await uploadMultipleImages(
          restaurantImageFromFE,
          `restaurant/${currentUser.phone}/restaurantPhotos`,
        );
        dataKeys.push("restaurantImage");
        restaurantDataFromFE.restaurantImage = restaurantImage;
      }

      const newRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        ...restaurantDataFromFE,
      });
      return res.status(201).json({
        message: "Restaurant profile created successfully",
        data: newRestaurant,
      });
    } else {
      if (coverImageFromFE) {
        await deleteSingleImage(existingRestaurant.coverImage);

        const coverImage = await UploadSingleImage(
          coverImageFromFE,
          `restaurant/${currentUser.phone}/coverPhoto`,
        );
        dataKeys.push("coverImage");
        restaurantDataFromFE.coverImage = coverImage;
      }
      if (restaurantDataFromFE.existingRestaurantImages) {
        try {
          const keptImages = JSON.parse(restaurantDataFromFE.existingRestaurantImages);
          const keptImageUrls = keptImages.map((img) => img.url);
          
          // Find images that exist in the DB but are NOT in the keptImages array
          const imagesToDelete = existingRestaurant.restaurantImage.filter(
            (img) => !keptImageUrls.includes(img.url)
          );
          
          // Delete only the removed images from Cloudinary
          if (imagesToDelete.length > 0) {
            await deleteMultipleImages(imagesToDelete);
          }
          
          // Temporarily set restaurantDataFromFE.restaurantImage to keptImages
          restaurantDataFromFE.restaurantImage = keptImages;
          dataKeys.push("restaurantImage");
        } catch (e) {
          console.error("Failed to parse existingRestaurantImages", e);
        }
      }

      if (restaurantImageFromFE && restaurantImageFromFE.length > 0) {
        const newImages = await uploadMultipleImages(
          restaurantImageFromFE,
          `restaurant/${currentUser.phone}/restaurantPhotos`,
        );
        
        dataKeys.push("restaurantImage");
        if (restaurantDataFromFE.restaurantImage) {
           restaurantDataFromFE.restaurantImage = [...restaurantDataFromFE.restaurantImage, ...newImages];
        } else {
           restaurantDataFromFE.restaurantImage = newImages;
        }
      }
      dataKeys.forEach((key) => {
        if (restaurantDataFromFE[key] !== undefined) {
          existingRestaurant.set(key, restaurantDataFromFE[key]);
        }
      });
      await existingRestaurant.save();
      return res.status(200).json({
        message: "Restaurant profile updated successfully",
        data: existingRestaurant,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const toggleRestaurantStatus = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { restaurantId } = req.body;
    
    if (!restaurantId) {
      return res.status(400).json({ message: "restaurantId is required" });
    }

    const existingRestaurant = await Restaurant.findOne({
      _id: restaurantId,
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant profile not found",
        data: null,
      });
    }

    existingRestaurant.isOpen = !existingRestaurant.isOpen;
    await existingRestaurant.save();

    return res.status(200).json({
      message: `Restaurant is now ${existingRestaurant.isOpen ? "Open" : "Closed"}`,
      data: existingRestaurant,
    });
  } catch (error) {
    next(error);
  }
};

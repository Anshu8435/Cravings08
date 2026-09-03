import Restaurant from "../models/restaurant.model.js";

// Fetch all restaurants for admin
export const getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({}).populate("managerId", "fullName email phone");
    res.status(200).json({
      message: "Restaurants fetched successfully",
      data: restaurants,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// Update restaurant status
export const updateRestaurantStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // active, inactive, blocked

    if (!["active", "inactive", "blocked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      message: `Restaurant status updated to ${status}`,
      data: restaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

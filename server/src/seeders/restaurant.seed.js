import Restaurant from "../models/restaurant.model.js";
import User from "../models/user.model.js";
import Menu from "../models/menu.model.js";

const bhopalRestaurants = [
  {
    restaurantName: "Manohar Dairy and Restaurant",
    address: "Hamidia Road, MP Nagar",
    city: "Bhopal",
    cuisineTypes: ["Indian", "Sweets", "Fast Food"],
    rating: 4.8,
    numReviews: 1240,
    openingHours: "08:00",
    closingHours: "22:30",
    servingHours: { openingTime: "08:00", closingTime: "22:30" },
    imageName: "bgImage1.jpg", // From your assets
  },
  {
    restaurantName: "Sagar Gaire Fast Food",
    address: "10 No. Market, Arera Colony",
    city: "Bhopal",
    cuisineTypes: ["Fast Food", "Chinese", "Italian"],
    rating: 4.6,
    numReviews: 3105,
    openingHours: "11:00",
    closingHours: "23:00",
    servingHours: { openingTime: "11:00", closingTime: "23:00" },
    imageName: "bgImage2.jpg",
  },
  {
    restaurantName: "Zam Zam Fast Food",
    address: "Peer Gate Area, Old Bhopal",
    city: "Bhopal",
    cuisineTypes: ["Mughlai", "Biryani", "Non-Veg"],
    rating: 4.7,
    numReviews: 2450,
    openingHours: "12:00",
    closingHours: "23:59",
    servingHours: { openingTime: "12:00", closingTime: "23:59" },
    imageName: "bgImage3.jpg",
  },
  {
    restaurantName: "Sharma & Vishnu Fast Food",
    address: "Chetak Bridge, MP Nagar",
    city: "Bhopal",
    cuisineTypes: ["Chinese", "North Indian", "Snacks"],
    rating: 4.4,
    numReviews: 1890,
    openingHours: "10:00",
    closingHours: "23:00",
    servingHours: { openingTime: "10:00", closingTime: "23:00" },
    imageName: "bgImage4.jpg",
  },
  {
    restaurantName: "Bake N Shake",
    address: "10 No. Stop, Arera Colony",
    city: "Bhopal",
    cuisineTypes: ["Bakery", "Continental", "Beverages"],
    rating: 4.5,
    numReviews: 950,
    openingHours: "09:00",
    closingHours: "22:30",
    servingHours: { openingTime: "09:00", closingTime: "22:30" },
    imageName: "bgImage1.jpg",
  }
];

const restaurantSeed = async () => {
  try {
    console.log("Clearing old restaurants and menus...");
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});

    console.log("Seeding real Bhopal restaurants...");

    for (let [index, rest] of bhopalRestaurants.entries()) {
      let managerEmail = `manager${(index % 5) + 1}@gmail.com`;
      let manager = await User.findOne({ email: managerEmail });
      if (!manager) {
        console.log(`Manager ${managerEmail} not found!`);
        continue;
      }
      // Assign real Unsplash images based on the restaurant
      let imageUrl = "";
      if (rest.restaurantName.includes("Manohar Dairy")) {
        imageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200";
      } else if (rest.restaurantName.includes("Sagar Gaire")) {
        imageUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200";
      } else if (rest.restaurantName.includes("Zam Zam")) {
        imageUrl = "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200";
      } else if (rest.restaurantName.includes("Sharma & Vishnu")) {
        imageUrl = "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200";
      } else if (rest.restaurantName.includes("Bake N Shake")) {
        imageUrl = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1200";
      } else {
        imageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200";
      }
      
      const newRest = await Restaurant.create({
        managerId: manager._id,
        restaurantName: rest.restaurantName,
        email: `${rest.restaurantName.replace(/\s+/g, '').toLowerCase()}@bhopal.com`,
        phone: "9" + Math.floor(100000000 + Math.random() * 900000000),
        address: rest.address,
        city: rest.city,
        state: "Madhya Pradesh",
        pinCode: "462001",
        country: "India",
        description: `Experience the best of ${rest.cuisineTypes[0]} at ${rest.restaurantName}`,
        restaurantType: "both",
        cuisineTypes: rest.cuisineTypes,
        status: "active",
        isOpen: true,
        averageRating: rest.rating,
        numReviews: rest.numReviews,
        servingHours: rest.servingHours,
        restaurantImage: [{ url: imageUrl, publicId: "mock_id" }],
        coverImage: { url: imageUrl, publicId: "mock_id" },
      });

      await Menu.create({
        restaurantId: newRest._id,
        menuItems: []
      });

      console.log(`Created restaurant: ${newRest.restaurantName}`);
    }

    console.log("Real Bhopal Restaurants seeding complete!");
  } catch (error) {
    console.log("Error seeding restaurants: ", error.message);
  }
};

export default restaurantSeed;

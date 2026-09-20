import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/ApiConfig";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import NoDataFound from "../components/NoDataFound";
import defaultRestaurantImage from "../assets/Samplerestaurant.jpg";
import { IoSearch, IoStar } from "react-icons/io5";

const OrderNow = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/public/restaurants");
      setRestaurants(response.data.data);
      setFilteredRestaurants(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during fetching restaurants. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = restaurants.filter(
        (r) =>
          r.restaurantName.toLowerCase().includes(lowerQuery) ||
          r.cuisineTypes?.some((c) => c.toLowerCase().includes(lowerQuery)) ||
          r.city.toLowerCase().includes(lowerQuery)
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchQuery, restaurants]);

  const handleRestaurant = (restaurant) => {
    navigate(`/restaurant-details/${restaurant._id}`);
  };

  if (isLoading) {
    return <Loader height="100vh" width="100%" />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16 font-sans">
      {/* Search Header */}
      <div className="bg-[#FAF7F2] py-6 px-4">
        <div className="max-w-5xl mx-auto bg-[#FAF7F2] rounded-lg shadow-sm border border-gray-300/60 p-1">
           <div className="bg-white rounded-md flex items-center p-2">
             <IoSearch className="text-gray-500 mx-2" size={20} />
             <input
               type="text"
               placeholder="Search restaurants or cuisines..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full py-1.5 outline-none text-gray-700 bg-transparent text-sm font-medium"
             />
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">All Restaurants</h1>
          <p className="text-gray-600 font-medium text-sm">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => {
              const image = restaurant?.coverImage?.url || restaurant?.restaurantImage?.[0]?.url || defaultRestaurantImage;
              return (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-48 shrink-0">
                    <img
                      src={image}
                      alt={restaurant.restaurantName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-[#c2410c] text-white px-2 py-0.5 rounded flex items-center gap-1 font-bold text-xs shadow-md">
                      <IoStar size={12} />
                      {restaurant.averageRating?.toFixed(1) || "4.5"}
                    </div>
                  </div>
                  
                  {/* Content Container */}
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {restaurant.restaurantName}
                    </h2>
                    <p className="text-gray-600 text-xs mb-4 line-clamp-3 font-medium">
                      {restaurant.description || "Enjoy delicious food from " + restaurant.restaurantName + "."}
                    </p>
                    
                    {/* Cuisines */}
                    <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                      {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 ? (
                        restaurant.cuisineTypes.slice(0, 3).map((cuisine, idx) => (
                          <span
                            key={idx}
                            className="bg-[#FAF7F2] text-gray-600 text-[10px] uppercase font-bold px-2 py-1 rounded border border-gray-200"
                          >
                            {cuisine}
                          </span>
                        ))
                      ) : (
                        <span className="bg-[#FAF7F2] text-gray-600 text-[10px] uppercase font-bold px-2 py-1 rounded border border-gray-200">
                          Various
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleRestaurant(restaurant)}
                      className="w-full bg-[#c2410c] text-white py-2 rounded font-bold hover:bg-[#a3360a] transition mt-2 shadow-sm text-sm"
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoDataFound
            height="50vh"
            width="100%"
            text="No Restaurants Found"
          />
        )}
      </div>
    </div>
  );
};

export default OrderNow;

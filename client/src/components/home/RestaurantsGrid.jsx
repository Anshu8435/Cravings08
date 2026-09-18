import React from "react";
import { IoStar } from "react-icons/io5";
import CravingFeed from "../../components/CravingFeed";

const RestaurantsGrid = ({ 
  viewMode, 
  setViewMode, 
  loading, 
  filteredRestaurants, 
  navigate, 
  selectedCategory, 
  categories, 
  setSearchQuery, 
  setSelectedCategory 
}) => {
  return (
    <section id="restaurants-section" className="py-4 md:py-8 bg-linear-to-b from-(--color-primary) to-(--color-primary-content)">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl inline-flex shadow-inner">
            <button
              onClick={() => setViewMode("feed")}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                viewMode === "feed" 
                  ? "bg-(--color-primary) text-white shadow-md" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              🔥 Craving Feed
            </button>
            <button
              onClick={() => setViewMode("restaurants")}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                viewMode === "restaurants" 
                  ? "bg-(--color-primary) text-white shadow-md" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              🏢 Restaurants
            </button>
          </div>
        </div>

        {viewMode === "feed" ? (
          <div className="mb-16">
            <CravingFeed />
          </div>
        ) : (
          <div className="mb-12">
            {/* Results Header */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-(--color-primary-content) mb-2">
                {selectedCategory === "all"
                  ? "Featured Restaurants"
                  : `${categories.find((c) => c.id === selectedCategory)?.label} Options`}
              </h2>
              <p className="text-(--color-primary-content)/70">
                {filteredRestaurants.length} restaurant
                {filteredRestaurants.length !== 1 ? "s" : ""} available
              </p>
            </div>

            {/* Restaurants Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
                <p className="mt-4 text-(--color-base-content)">
                  Loading restaurants...
                </p>
              </div>
            ) : filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => navigate(`/restaurant-details/${restaurant.id}`)}
                    className="flex flex-col bg-(--color-base-100) rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer transform hover:scale-105"
                  >
                    {/* Restaurant Image */}
                    <div className="relative h-56 overflow-hidden bg-(--color-base-200) group">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
                      
                      {/* Available Now Badge */}
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2 font-bold text-xs shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse border border-green-400 z-10 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        Open Now
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full flex items-center gap-1 font-bold text-sm shadow-lg z-10">
                        <IoStar className="text-yellow-500" size={16} />
                        {restaurant.rating.toFixed(1)}
                      </div>

                      {/* City Location */}
                      <div className="absolute bottom-3 left-4 text-white font-medium text-sm drop-shadow-md z-10 flex flex-col">
                         <span className="font-bold text-xl">{restaurant.name}</span>
                         <span className="opacity-90 text-xs mt-0.5">{restaurant.city}</span>
                      </div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="flex flex-col flex-1 p-5 bg-white">
                      <p className="text-(--color-base-content) text-sm mb-4 line-clamp-2 min-h-10">
                        {restaurant.description}
                      </p>

                      {/* Cuisines */}
                      <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                        {restaurant.cuisines.split(",").map((cuisine, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md capitalize font-medium"
                          >
                            {cuisine.trim()}
                          </span>
                        ))}
                      </div>

                      {/* Footer Info */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/restaurant-details/${restaurant.id}`);
                          }}
                          className="w-full bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                        >
                          Explore Menu
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-(--color-base-content) text-lg">
                  No restaurants found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 bg-(--color-primary) text-(--color-primary-content) px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RestaurantsGrid;

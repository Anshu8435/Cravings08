import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/ApiConfig';
import toast from 'react-hot-toast';
import NoDataFound from '../components/NoDataFound';
import defaultRestaurantImage from '../assets/Samplerestaurant.jpg';
import {
  IoSearch,
  IoStar,
  IoLocationOutline,
  IoTimeOutline,
  IoArrowForward,
  IoSparklesOutline,
} from 'react-icons/io5';

const OrderNow = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/public/restaurants');
      const list = response.data.data || [];
      setRestaurants(list);
      setFilteredRestaurants(list);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load restaurants. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    let filtered = restaurants;

    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.restaurantName.toLowerCase().includes(lowerQuery) ||
          r.cuisineTypes?.some((c) => c.toLowerCase().includes(lowerQuery)) ||
          r.city?.toLowerCase().includes(lowerQuery),
      );
    }

    if (selectedCuisine !== 'All') {
      const lowerCuisine = selectedCuisine.toLowerCase();
      filtered = filtered.filter((r) =>
        r.cuisineTypes?.some((c) => c.toLowerCase().includes(lowerCuisine)),
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedCuisine, restaurants]);

  const handleRestaurant = (restaurant) => {
    navigate(`/restaurant-details/${restaurant._id}`);
  };

  const cuisineTabs = ['All', 'North Indian', 'Biryani', 'Pizza', 'Burgers', 'Chinese', 'Desserts'];

  return (
    <div className="min-h-screen bg-[#080a11] text-gray-100 pb-24 font-sans selection:bg-[#ff5400] selection:text-white">
      {/* Search & Hero Banner */}
      <div className="bg-[#0e121d] border-b border-white/10 py-14 px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#ff5400]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/30 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-3">
            <IoSparklesOutline /> Gourmet Catalog
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight mb-3">
            Explore Handcrafted Menus Near You
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-medium max-w-xl mx-auto mb-8">
            Discover verified Michelin-partner kitchens, chef-curated tasting menus, and
            precision-timed delivery
          </p>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-[#131826]/90 rounded-2xl border border-white/15 p-2 shadow-2xl focus-within:border-[#ff5400] focus-within:ring-2 focus-within:ring-[#ff5400]/30 transition-all">
              <IoSearch className="text-[#ff5400] ml-3 mr-2" size={22} />
              <input
                type="text"
                placeholder="Search restaurants, cuisines (e.g. Biryani, Italian, Sushi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 outline-none text-white placeholder-gray-500 bg-transparent text-sm sm:text-base font-semibold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Cuisine Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {cuisineTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCuisine(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  selectedCuisine === tab
                    ? 'bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white shadow-lg shadow-[#ff5400]/25'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white font-['Space_Grotesk'] tracking-tight">
              {selectedCuisine === 'All'
                ? 'Available Haute Kitchens'
                : `${selectedCuisine} Kitchens`}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              Showing {filteredRestaurants.length} premium culinary destination
              {filteredRestaurants.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-[#131826] rounded-3xl p-4 border border-white/10 animate-pulse"
              >
                <div className="w-full h-48 bg-white/5 rounded-2xl mb-4"></div>
                <div className="h-6 bg-white/5 rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-white/5 rounded-md w-1/2 mb-4"></div>
                <div className="h-10 bg-white/5 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredRestaurants.map((restaurant) => {
              const image =
                restaurant?.coverImage?.url ||
                restaurant?.restaurantImage?.[0]?.url ||
                defaultRestaurantImage;

              return (
                <div
                  key={restaurant._id}
                  onClick={() => handleRestaurant(restaurant)}
                  className="group bg-[#0e121d] rounded-3xl overflow-hidden border border-white/10 hover:border-[#ff5400]/50 transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,84,0,0.15)] transition-all duration-500 flex flex-col cursor-pointer"
                >
                  {/* Restaurant Image Container */}
                  <div className="relative w-full h-52 overflow-hidden bg-black">
                    <img
                      src={image}
                      alt={restaurant.restaurantName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e121d] via-transparent to-black/40"></div>

                    {/* Rating Pill */}
                    <div className="absolute top-3.5 right-3.5 bg-black/70 backdrop-blur-md text-amber-400 px-3 py-1 rounded-full flex items-center gap-1 font-black text-xs shadow-md border border-amber-500/20">
                      <IoStar size={13} className="text-amber-400 fill-amber-400" />
                      <span>{restaurant.averageRating?.toFixed(1) || '4.5'}</span>
                    </div>

                    {/* Delivery Time Badge */}
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold border border-white/10">
                      <IoTimeOutline size={14} className="text-[#ff5400]" />
                      <span>25-35 mins</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white font-['Space_Grotesk'] mb-1.5 group-hover:text-[#ff5400] transition-colors line-clamp-1">
                        {restaurant.restaurantName}
                      </h3>

                      <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
                        {restaurant.description ||
                          `Authentic culinary specialties prepared with passion in ${restaurant.city || 'your area'}.`}
                      </p>

                      {/* Cuisines */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 ? (
                          restaurant.cuisineTypes.slice(0, 3).map((cuisine, idx) => (
                            <span
                              key={idx}
                              className="bg-white/5 text-[#ff5400] text-[10px] uppercase font-black px-2.5 py-1 rounded-lg border border-[#ff5400]/20"
                            >
                              {cuisine}
                            </span>
                          ))
                        ) : (
                          <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-black px-2.5 py-1 rounded-lg">
                            Multi-Cuisine
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Location & View Menu CTA */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 font-medium">
                        <IoLocationOutline size={14} className="text-[#ff5400]" />
                        <span className="line-clamp-1">
                          {restaurant.address || restaurant.city || 'Downtown Area'}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestaurant(restaurant);
                        }}
                        className="w-full bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white py-3 rounded-2xl font-black text-xs hover:shadow-lg hover:shadow-[#ff5400]/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <span>View Gourmet Menu</span>
                        <IoArrowForward size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#0e121d] rounded-3xl border border-white/10">
            <NoDataFound height="200px" width="100%" text="No matching restaurants found" />
            <p className="text-gray-400 text-sm mt-3">
              Try clearing your filters or searching for another dish.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine('All');
              }}
              className="mt-5 bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white px-6 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-[#ff5400]/25 hover:shadow-[#ff5400]/40 transition active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderNow;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/ApiConfig';
import toast from 'react-hot-toast';
import NoDataFound from '../components/NoDataFound';
import NoDataFoundGif from '../assets/NoDataFound.gif';
import {
  IoArrowBack,
  IoStar,
  IoLocationOutline,
  IoTimeOutline,
  IoSparklesOutline,
} from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const RestaurantDetailsPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { isLogin } = useAuth();

  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getCartQuantity, handleAddToCart, handleRemoveFromCart } = useCart();

  const fetchRestaurantDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/public/restaurant-detail/${restaurantId}`);
      setRestaurantDetails(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Could not load restaurant menu. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
  }, [restaurantId]);

  const onAddItem = (item) => {
    if (!isLogin) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    handleAddToCart({ ...item, restaurantId: restaurantDetails?.restaurantId?._id });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#080a11] text-white">
        <img
          src={NoDataFoundGif}
          alt="Loading..."
          className="w-32 h-32 object-contain filter invert opacity-80"
        />
        <h2 className="mt-4 text-xl font-black font-['Space_Grotesk'] text-[#ff5400] animate-pulse">
          Curating Handcrafted Menu...
        </h2>
      </div>
    );
  }

  if (!restaurantDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#080a11] text-white p-6">
        <NoDataFound height="auto" width="100%" text="Restaurant Not Found" />
        <button
          onClick={() => navigate('/order-now')}
          className="mt-6 bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white px-8 py-3 rounded-2xl shadow-lg font-black hover:scale-105 active:scale-95 transition"
        >
          Explore Other Haute Kitchens
        </button>
      </div>
    );
  }

  const restaurant = restaurantDetails.restaurantId;
  const menuItems = restaurantDetails.menuItems || [];

  const defaultRestaurantImage =
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop';
  const restaurantImage =
    restaurant?.coverImage?.url || restaurant?.restaurantImage?.[0]?.url || defaultRestaurantImage;

  return (
    <div className="min-h-screen bg-[#080a11] pb-24 font-sans text-gray-100 selection:bg-[#ff5400] selection:text-white">
      {/* Restaurant Header Banner Area */}
      <div className="bg-[#0e121d] border-b border-white/10 shadow-2xl relative z-10 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[300px] bg-[#ff5400]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 relative z-10">
          {/* Back button */}
          <button
            onClick={() => navigate('/order-now')}
            className="flex items-center text-[#ff5400] font-black text-xs sm:text-sm mb-6 hover:translate-x-[-4px] transition-transform"
          >
            <IoArrowBack className="mr-2" size={18} />
            Back to Kitchens Catalog
          </button>

          {/* Restaurant Info Card */}
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
            <div className="w-full md:w-80 h-56 rounded-3xl overflow-hidden shadow-2xl shrink-0 border border-white/10 bg-black">
              <img
                src={restaurantImage}
                alt={restaurant?.restaurantName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 w-full flex flex-col justify-between self-stretch">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-black text-white font-['Space_Grotesk'] tracking-tight">
                    {restaurant?.restaurantName}
                  </h1>
                  <div className="flex items-center gap-1.5 bg-black/60 text-amber-400 border border-amber-500/20 px-3.5 py-1 rounded-full font-black text-sm">
                    <IoStar size={16} className="text-amber-400 fill-amber-400" />
                    <span>{restaurant?.rating ? restaurant.rating.toFixed(1) : '4.5'}</span>
                    <span className="text-gray-400 font-normal">
                      ({restaurant?.numReviews || 48}+)
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                  {restaurant?.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant?.cuisines
                    ? restaurant.cuisines.split(',').map((c, i) => (
                        <span
                          key={i}
                          className="bg-white/5 text-[#ff5400] border border-[#ff5400]/20 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider"
                        >
                          {c.trim()}
                        </span>
                      ))
                    : null}
                </div>
              </div>

              {/* Address and Delivery Time */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10 text-xs sm:text-sm text-gray-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <IoLocationOutline size={18} className="text-[#ff5400]" />
                  {restaurant?.address || restaurant?.city || 'Downtown Outlet'}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <IoTimeOutline size={18} className="text-[#ff5400]" />
                  25-35 mins thermal delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/30 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-2">
              <IoSparklesOutline /> Master Kitchen Selection
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk'] tracking-tight">
              Curated Menu ({menuItems.length})
            </h2>
          </div>
        </div>

        {menuItems.length === 0 ? (
          <div className="text-center py-20 bg-[#0e121d] rounded-3xl border border-white/10">
            <p className="text-gray-400 font-medium">No dishes currently available in this menu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {menuItems.map((item) => {
              const qty = getCartQuantity(item._id);
              const isVeg = item.type?.toLowerCase() === 'veg' || item.isVeg;
              const itemImage =
                item.image?.url ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';

              return (
                <div
                  key={item._id}
                  className="bg-[#131826] rounded-3xl p-5 flex gap-4 border border-white/10 hover:border-[#ff5400]/40 transition-all duration-300 shadow-xl"
                >
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 bg-black">
                    <img
                      src={itemImage}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm ${
                          isVeg ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-white font-['Space_Grotesk'] mb-1">
                        {item.itemName}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs font-black text-[#ff5400]">₹</span>
                        <span className="text-xl font-black text-white font-['Space_Grotesk']">
                          {item.price}
                        </span>
                      </div>

                      {qty === 0 ? (
                        <button
                          onClick={() => onAddItem(item)}
                          className="bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-[#ff5400]/25 hover:shadow-[#ff5400]/40 hover:scale-105 active:scale-95 transition-all"
                        >
                          + Add
                        </button>
                      ) : (
                        <div className="flex items-center bg-black/40 rounded-xl border border-white/10 overflow-hidden h-9">
                          <button
                            onClick={() =>
                              handleRemoveFromCart({ ...item, restaurantId: restaurant._id }, false)
                            }
                            className="px-3 text-[#ff5400] hover:bg-white/10 transition font-black text-base flex items-center justify-center h-full"
                          >
                            −
                          </button>
                          <span className="px-2 font-black text-white min-w-6 text-center text-xs">
                            {qty}
                          </span>
                          <button
                            onClick={() => onAddItem(item)}
                            className="px-3 text-[#ff5400] hover:bg-white/10 transition font-black text-base flex items-center justify-center h-full"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailsPage;

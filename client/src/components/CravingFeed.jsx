import React, { useState, useEffect } from 'react';
import api from '../config/ApiConfig';
import { FaHeart, FaTimes, FaShoppingCart, FaFire, FaLeaf, FaDumbbell, FaSlidersH, FaMotorcycle, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import DishCard from './DishCard';

const CravingFeed = () => {
  const [dishes, setDishes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [slideOut, setSlideOut] = useState('');
  const { handleAddToCart, cart: globalCart } = useCart();

  // Macro filter state
  const [showFilters, setShowFilters] = useState(false);
  const [macros, setMacros] = useState({
    maxCalories: '',
    minProtein: ''
  });

  useEffect(() => {
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [macros]);

  // Auto-swipe every 3 seconds (paused on hover)
  useEffect(() => {
    if (dishes.length > 0 && !loading && !isHovered) {
      const autoSwipeTimer = setInterval(() => {
        handleSwipe('left');
      }, 3000);
      return () => clearInterval(autoSwipeTimer);
    }
  }, [currentIndex, dishes.length, loading, isHovered]);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const fetchFeed = async () => {
    try {
      setLoading(true);

      // Build query string based on macros
      const params = new URLSearchParams();
      if (macros.maxCalories) params.append('maxCalories', macros.maxCalories);
      if (macros.minProtein) params.append('minProtein', macros.minProtein);

      const { data } = await api.get(`/public/dishes/feed?${params.toString()}`);
      setDishes(data.data || []);
      setCurrentIndex(0); // Reset index when feed reloads
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      toast.error('Failed to load cravings feed');
    } finally {
      setLoading(false);
    }
  };

  const handleMacroChange = (e) => {
    const { name, value } = e.target;
    setMacros(prev => ({ ...prev, [name]: value }));
  };

  const handleSwipe = (direction) => {
    if (slideOut) return;

    if (direction === 'right') {
      const currentDish = dishes[currentIndex];
      setCart(prev => [...prev, currentDish]);
      toast.success('Added to cravings list!');
    }

    setSlideOut(direction === 'left' ? 'left' : 'right');

    setTimeout(() => {
      if (currentIndex < dishes.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        toast("You've seen all the dishes! Looping back...", { icon: '🍽️' });
        setCurrentIndex(0);
      }
      setSlideOut('');
    }, 700);
  };

  const addToCart = () => {
    const currentDish = dishes[currentIndex];
    if (globalCart.length > 0 && globalCart[0].item.restaurantId !== currentDish.restaurantId) {
      toast.error("You can only order from one restaurant at a time. Please clear your cart first.");
      return;
    }
    handleAddToCart(currentDish);
    if (currentDish?.travelScore !== undefined && currentDish.travelScore < 60) {
      toast.error(`Warning: This item may not travel well! (${currentDish.travelScore}/100)`, { duration: 4000 });
    }
  };

  const totalCalories = cart.reduce((sum, item) => sum + (item.macros?.calories || 0), 0);
  const totalProtein = cart.reduce((sum, item) => sum + (item.macros?.protein || 0), 0);
  const totalCarbs = cart.reduce((sum, item) => sum + (item.macros?.carbs || 0), 0);
  const totalFats = cart.reduce((sum, item) => sum + (item.macros?.fats || 0), 0);
  const firstItemName = cart.length > 0 ? cart[0].itemName : "";

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto relative">

      {/* Macro Filters Header */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_20px_-4px_rgba(249,115,22,0.1)] border border-orange-100 dark:border-orange-900/50 p-4 mb-4 transition-all">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
          <div className="flex items-center gap-2 text-(--color-primary) font-bold text-lg">
            <FaDumbbell className="animate-pulse" /> <span>Fitness Goals</span>
          </div>
          <FaSlidersH className={`text-orange-400 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
        </div>

        {showFilters && (
          <div className="mt-4 flex gap-4 animate-in slide-in-from-top-2 fade-in">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Max Calories</label>
              <input
                type="number"
                name="maxCalories"
                value={macros.maxCalories}
                onChange={handleMacroChange}
                placeholder="e.g. 500"
                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm outline-none focus:border-(--color-primary)"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Min Protein (g)</label>
              <input
                type="number"
                name="minProtein"
                value={macros.minProtein}
                onChange={handleMacroChange}
                placeholder="e.g. 30"
                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm outline-none focus:border-(--color-primary)"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="w-full bg-(--color-primary) text-white rounded-2xl p-4 mb-4 shadow-lg animate-in slide-in-from-top-2 border border-orange-500/30">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg flex items-center gap-2"><FaShoppingCart /> Your Selections</h3>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold">{cart.length} items</span>
          </div>
          <div className="text-sm font-medium mb-3 opacity-90 bg-black/10 p-2 rounded-md max-h-24 overflow-y-auto">
            Selected Items: <span className="font-bold text-white leading-relaxed">{cart.map(item => item.itemName).join(', ')}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-lg p-2 text-center border border-white/10 shadow-inner">
              <span className="block text-xs uppercase tracking-wider opacity-80 mb-0.5">Total Calories</span>
              <span className="font-bold text-lg text-orange-200">🔥 {totalCalories}</span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 text-center border border-white/10 shadow-inner">
              <span className="block text-xs uppercase tracking-wider opacity-80 mb-0.5">Total Protein</span>
              <span className="font-bold text-lg text-emerald-200">💪 {totalProtein}g</span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 text-center border border-white/10 shadow-inner">
              <span className="block text-xs uppercase tracking-wider opacity-80 mb-0.5">Total Carbs</span>
              <span className="font-bold text-lg text-blue-200">🍞 {totalCarbs}g</span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 text-center border border-white/10 shadow-inner">
              <span className="block text-xs uppercase tracking-wider opacity-80 mb-0.5">Total Fats</span>
              <span className="font-bold text-lg text-yellow-200">🥑 {totalFats}g</span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-[70vh] items-center justify-center w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-(--color-primary)"></div>
        </div>
      ) : dishes.length === 0 ? (
        <div className="flex h-[70vh] w-full flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No cravings fit those macros!</h2>
          <p className="text-gray-500 mt-2">Try relaxing your fitness goals a bit.</p>
        </div>
      ) : (
        <div
          className="w-full h-[70vh] perspective-[1000px] relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Bottom Card (Next Item) */}
          {dishes.length > 1 && (
            <div className={`absolute inset-0 z-0 transition-all duration-700 ${slideOut ? 'scale-100 opacity-100 translate-y-0' : 'scale-[0.95] opacity-50 translate-y-4'}`}>
              <DishCard
                dish={dishes[(currentIndex + 1) % dishes.length]}
                isFlipped={false}
                handleSwipe={() => { }}
                addToCart={() => { }}
              />
            </div>
          )}

          {/* Top Card (Current Item) */}
          <div
            key={currentIndex}
            className={`absolute inset-0 z-10 transition-all duration-700 ${slideOut === 'left' ? '-translate-x-[120%] opacity-0 rotate-[-10deg]' :
                slideOut === 'right' ? 'translate-x-[120%] opacity-0 rotate-[10deg]' :
                  ''
              }`}
          >
            <DishCard
              dish={dishes[currentIndex]}
              isFlipped={isFlipped}
              handleSwipe={handleSwipe}
              addToCart={addToCart}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CravingFeed;

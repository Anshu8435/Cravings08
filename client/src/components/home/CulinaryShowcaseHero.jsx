import React, { useState, useEffect, useRef } from 'react';
import {
  IoStar,
  IoFlame,
  IoTimeOutline,
  IoThermometerOutline,
  IoBagAdd,
  IoSparkles,
  IoChevronForward,
  IoCheckmarkCircle,
} from 'react-icons/io5';
import { useCart } from '../../context/CartContext';

const culinaryShowcaseDishes = [
  {
    id: 'hero-dish-01',
    restaurantId: 'rest-chef-02',
    name: 'San Marzano Burrata Tartufo',
    category: 'Wood-Fired 480°C',
    cuisine: 'Napoli Heritage',
    price: 599,
    rating: 4.98,
    reviews: 580,
    prepTime: '18 mins',
    temperature: '65°C Active Thermal',
    nutrition: '680 kcal • 28g Protein',
    tag: 'CHEF MARCO SIGNATURE',
    accent: 'from-[#ff5400] to-[#e11d48]',
    ringColor: '#ff5400',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85',
    description:
      '72h fermented sourdough, San Marzano D.O.P., fresh pugliese burrata injected with white truffle oil.',
  },
  {
    id: 'hero-dish-02',
    restaurantId: 'rest-chef-05',
    name: 'Royal Saffron Dum Handi',
    category: 'Royal Heritage',
    cuisine: 'Nizam Secret Recipe',
    price: 489,
    rating: 4.96,
    reviews: 740,
    prepTime: '22 mins',
    temperature: '70°C Sealed Clay',
    nutrition: '740 kcal • 38g Protein',
    tag: 'CLAY OVEN SEALED',
    accent: 'from-[#f59e0b] to-[#ff5400]',
    ringColor: '#f59e0b',
    image:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=85',
    description:
      'Aged basmati slow-dum cooked in sealed earthen handi with Kashmiri saffron and 32 heritage spices.',
  },
  {
    id: 'hero-dish-03',
    restaurantId: 'rest-chef-01',
    name: 'Smoked Prime Wagyu & Truffle',
    category: 'Haute Brioche',
    cuisine: 'Artisan Atelier',
    price: 549,
    rating: 4.95,
    reviews: 620,
    prepTime: '20 mins',
    temperature: '65°C Thermal Lock',
    nutrition: '640 kcal • 42g Protein',
    tag: 'PRIME A5 BLEND',
    accent: 'from-[#e11d48] to-[#9333ea]',
    ringColor: '#e11d48',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
    description:
      'Double Prime A5 blend patty, shaved black summer truffle, smoked aged Gruyère on French brioche.',
  },
  {
    id: 'hero-dish-04',
    restaurantId: 'rest-chef-04',
    name: '24K Gold Dark Valrhona Lava',
    category: 'French Patisserie',
    cuisine: 'Master Chocolatier',
    price: 349,
    rating: 4.99,
    reviews: 890,
    prepTime: '14 mins',
    temperature: 'Warm Core • Chilled Gelato',
    nutrition: '520 kcal • 12g Protein',
    tag: 'EDIBLE 24K GOLD',
    accent: 'from-[#f59e0b] to-[#10b981]',
    ringColor: '#10b981',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85',
    description:
      '70% Valrhona single-origin molten core paired with Tahitian vanilla bean gelato and 24K gold foil.',
  },
];

const CulinaryShowcaseHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const { handleAddToCart, cart } = useCart();

  const currentDish = culinaryShowcaseDishes[activeIndex];

  // Auto-switch dish every 5 seconds if not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % culinaryShowcaseDishes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Subtle 3D Tilt calculation based on mouse movement
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / (rect.height / 2)) * -10,
      y: (x / (rect.width / 2)) * 10,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const inCartItem = cart.find((c) => c.item._id === currentDish.id);
  const qty = inCartItem ? inCartItem.quantity : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg lg:max-w-none flex flex-col items-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D Floating Stage Container */}
      <div
        className="relative w-full transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Background Ambient Ring & Light Halo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-[100px] opacity-40 transition-colors duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${currentDish.ringColor} 0%, transparent 70%)`,
          }}
        />

        {/* Futuristic Floating Pedestal Rings */}
        <div className="relative mx-auto w-72 h-72 sm:w-88 sm:h-88 lg:w-96 lg:h-96 flex items-center justify-center">
          {/* Outer Pulsing Laser Ring */}
          <div
            className="absolute inset-0 rounded-full border border-dashed transition-all duration-700 animate-spin-slow opacity-30"
            style={{ borderColor: currentDish.ringColor }}
          />

          {/* Inner Glowing Orbit Ring */}
          <div className="absolute inset-6 rounded-full border border-white/10 backdrop-blur-3xs shadow-2xl" />

          {/* Elevated Circular Glass Plinth */}
          <div className="absolute inset-10 rounded-full bg-gradient-to-b from-[#182032]/80 via-[#0e121d]/90 to-[#080a11] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center justify-center overflow-hidden">
            {/* Ambient reflective sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          </div>

          {/* The Hero Dish Display (Smooth scale & fade transition) */}
          <div
            key={currentDish.id}
            className="relative z-20 w-64 h-64 sm:w-76 sm:h-76 lg:w-84 lg:h-84 rounded-full overflow-hidden p-2 group transition-all duration-700 animate-fadeIn"
            style={{ transform: 'translateZ(30px)' }}
          >
            <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
              <img
                src={currentDish.image}
                alt={currentDish.name}
                className="w-full h-full object-cover transform scale-105 group-hover:scale-115 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Center Culinary Badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-black tracking-widest uppercase text-white flex items-center gap-1.5 shadow-xl whitespace-nowrap">
                <IoSparkles className="text-[#ff5400] text-xs" />
                <span>{currentDish.tag}</span>
              </div>
            </div>
          </div>

          {/* Floating Telemetry Card 1: Top Left - Temperature & Prep */}
          <div
            className="absolute -top-2 left-0 sm:-left-4 z-30 px-3.5 py-2.5 rounded-2xl bg-[#131826]/90 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-3 transition-all duration-500 hover:scale-105"
            style={{ transform: 'translateZ(45px)' }}
          >
            <div className="w-9 h-9 rounded-xl bg-[#ff5400]/15 flex items-center justify-center text-[#ff5400] text-lg">
              <IoThermometerOutline />
            </div>
            <div className="text-left">
              <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400">
                Heat Preservation
              </span>
              <span className="text-xs font-black text-white font-['Space_Grotesk']">
                {currentDish.temperature}
              </span>
            </div>
          </div>

          {/* Floating Telemetry Card 2: Top Right - Rating & Reviews */}
          <div
            className="absolute top-4 -right-2 sm:-right-6 z-30 px-3.5 py-2 rounded-2xl bg-[#131826]/90 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-2.5 transition-all duration-500 hover:scale-105"
            style={{ transform: 'translateZ(45px)' }}
          >
            <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
              <IoStar />
              <span>{currentDish.rating}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] font-bold text-gray-400">
              {currentDish.reviews}+ Reviews
            </span>
          </div>

          {/* Floating Telemetry Card 3: Bottom Right - Delivery Velocity */}
          <div
            className="absolute bottom-6 -right-2 sm:-right-4 z-30 px-3.5 py-2 rounded-2xl bg-[#131826]/90 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-2 transition-all duration-500 hover:scale-105"
            style={{ transform: 'translateZ(45px)' }}
          >
            <IoTimeOutline className="text-[#10b981] text-base" />
            <span className="text-xs font-black text-white font-['Space_Grotesk']">
              {currentDish.prepTime} Drop
            </span>
          </div>
        </div>

        {/* Active Dish Detail & Quick-Order Card */}
        <div
          className="mt-6 p-5 rounded-3xl bg-[#0e121d]/90 backdrop-blur-xl border border-white/10 shadow-2xl text-left"
          style={{ transform: 'translateZ(20px)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-[#ff5400]">
                  {currentDish.category}
                </span>
                <span className="text-[11px] font-bold text-gray-400">{currentDish.cuisine}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-['Space_Grotesk'] mt-1 leading-snug">
                {currentDish.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{currentDish.description}</p>
            </div>

            {/* Price tag */}
            <div className="text-right shrink-0">
              <span className="block text-[10px] font-bold text-gray-500 uppercase">
                Perfection
              </span>
              <div className="flex items-baseline gap-0.5 justify-end">
                <span className="text-xs font-black text-[#ff5400]">₹</span>
                <span className="text-2xl font-black text-white font-['Space_Grotesk']">
                  {currentDish.price}
                </span>
              </div>
            </div>
          </div>

          {/* Nutritional & Action Bar */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-4">
            <span className="text-[11px] font-semibold text-gray-400">
              📊 {currentDish.nutrition}
            </span>

            <button
              onClick={() =>
                handleAddToCart({
                  _id: currentDish.id,
                  restaurantId: currentDish.restaurantId,
                  itemName: currentDish.name,
                  price: currentDish.price,
                  image: { url: currentDish.image },
                  description: currentDish.description,
                })
              }
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs transition-all duration-300 shadow-md ${
                qty > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-[#ff5400] to-[#e11d48] hover:from-[#e04800] hover:to-[#cc163d] text-white shadow-[#ff5400]/25 hover:shadow-lg hover:shadow-[#ff5400]/40 active:scale-95'
              }`}
            >
              {qty > 0 ? (
                <>
                  <IoCheckmarkCircle className="text-sm" />
                  <span>Added ({qty})</span>
                </>
              ) : (
                <>
                  <IoBagAdd className="text-sm" />
                  <span>Order Masterpiece</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Interactive Course Selector Pills */}
        <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {culinaryShowcaseDishes.map((dish, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={dish.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-gray-900 shadow-lg scale-105 font-black'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: isSelected ? '#ff5400' : 'rgba(255,255,255,0.4)',
                  }}
                />
                <span>{dish.category.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CulinaryShowcaseHero;

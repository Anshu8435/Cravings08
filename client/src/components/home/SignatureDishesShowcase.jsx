import React, { useState } from 'react';
import {
  IoStar,
  IoFlame,
  IoTrophyOutline,
  IoTimeOutline,
  IoNutritionOutline,
  IoBagAdd,
} from 'react-icons/io5';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const signatureDishes = [
  {
    _id: 'sig-01',
    restaurantId: 'rest-chef-01',
    restaurantName: 'The Truffle Guild',
    name: 'Smoked Wagyu Brioche Truffle',
    category: 'burgers',
    price: 499,
    rating: 4.95,
    reviews: 420,
    calories: '680 kcal',
    protein: '42g Protein',
    prepTime: '22 mins',
    tag: 'CHEF SIGNATURE',
    isVeg: false,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description:
      'Double 100% Prime A5 Wagyu blend, black summer truffle carpaccio, smoked aged Gruyère, caramelized shallots on toasted French brioche.',
  },
  {
    _id: 'sig-02',
    restaurantId: 'rest-chef-02',
    restaurantName: 'Napoli 480°C',
    name: 'San Marzano Burrata Tartufo',
    category: 'pizza',
    price: 599,
    rating: 4.98,
    reviews: 580,
    calories: '720 kcal',
    protein: '28g Protein',
    prepTime: '18 mins',
    tag: 'WOOD-FIRED 480°',
    isVeg: true,
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description:
      '72-hour fermented sourdough crust, organic San Marzano tomatoes, fresh pugliese burrata injected with white truffle oil, wild basil.',
  },
  {
    _id: 'sig-03',
    restaurantId: 'rest-chef-03',
    restaurantName: 'Imperial Steam House',
    name: 'Saffron Prawn & Truffle Xiao Long Bao',
    category: 'asian',
    price: 449,
    rating: 4.92,
    reviews: 310,
    calories: '410 kcal',
    protein: '32g Protein',
    prepTime: '15 mins',
    tag: 'MICHELIN TASTE',
    isVeg: false,
    image:
      'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    description:
      'Silky translucent hand-pinched wrappers filled with aromatic saffron-infused broth, wild black tiger prawns, and shaved truffles.',
  },
  {
    _id: 'sig-04',
    restaurantId: 'rest-chef-04',
    restaurantName: 'Chocolatier Atelier',
    name: '24K Gold Dark Valrhona Lava',
    category: 'dessert',
    price: 349,
    rating: 4.99,
    reviews: 640,
    calories: '530 kcal',
    protein: '12g Protein',
    prepTime: '12 mins',
    tag: 'LUXURY PATISSERIE',
    isVeg: true,
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description:
      '70% Valrhona single-origin molten core with Tahitian vanilla bean gelato, dusted with genuine 24-karat edible gold foil leaf.',
  },
];

const SignatureDishesShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedMacro, setExpandedMacro] = useState(null);
  const { handleAddToCart, cart } = useCart();
  const navigate = useNavigate();

  const filteredDishes =
    activeCategory === 'all'
      ? signatureDishes
      : signatureDishes.filter((d) => d.category === activeCategory);

  return (
    <section className="py-24 bg-[#0e121d] relative overflow-hidden border-b border-white/5">
      {/* Background ambient lighting glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#ff5400]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#e11d48]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/30 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-4">
              <IoTrophyOutline className="text-sm" />
              <span>Section 03 • Haute Cuisine Curations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
              Signature{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5400] via-[#f59e0b] to-[#e11d48]">
                Masterpieces
              </span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
              Curated by master culinary chefs. Each recipe is packaged in vacuum-sealed, 65°C
              thermal cases to maintain kitchen-level perfection.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Curations' },
              { id: 'burgers', label: 'Brioche Crafts' },
              { id: 'pizza', label: 'Wood-Fired' },
              { id: 'asian', label: 'Artisan Steam' },
              { id: 'dessert', label: 'Decadence' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === tab.id
                    ? 'bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white shadow-lg shadow-[#ff5400]/25'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => {
            const inCartItem = cart.find((c) => c.item._id === dish._id);
            const qty = inCartItem ? inCartItem.quantity : 0;

            return (
              <div
                key={dish._id}
                className="group relative bg-[#131826] rounded-3xl overflow-hidden border border-white/10 hover:border-[#ff5400]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,84,0,0.15)] flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-black/40">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131826] via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black tracking-wider uppercase text-[#f59e0b] border border-[#f59e0b]/30">
                      {dish.tag}
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center p-0.5 ${
                        dish.isVeg
                          ? 'border-emerald-500 bg-emerald-950/80'
                          : 'border-rose-500 bg-rose-950/80'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dish.isVeg ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                    </span>
                  </div>

                  {/* Prep time telemetry badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-gray-300 border border-white/10 flex items-center gap-1">
                    <IoTimeOutline className="text-[#ff5400]" />
                    <span>{dish.prepTime}</span>
                  </div>

                  {/* Floating Rating Pill */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-xs font-black text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                    <IoStar className="text-amber-400" />
                    <span>{dish.rating}</span>
                    <span className="text-[10px] font-semibold text-gray-400">
                      ({dish.reviews})
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-black tracking-wider uppercase text-[#ff5400]">
                      {dish.restaurantName}
                    </span>
                    <h3 className="text-lg font-black text-white font-['Space_Grotesk'] mt-1 group-hover:text-[#ff5400] transition-colors leading-snug">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  {/* Nutritional Macro breakdown toggle */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <button
                      onClick={() => setExpandedMacro(expandedMacro === dish._id ? null : dish._id)}
                      className="w-full flex items-center justify-between text-[11px] text-gray-400 hover:text-white transition-colors py-1"
                    >
                      <span className="flex items-center gap-1 font-semibold">
                        <IoNutritionOutline className="text-[#f59e0b]" /> Nutritional Profile
                      </span>
                      <span className="text-[10px] text-[#ff5400] font-bold underline">
                        {expandedMacro === dish._id ? 'Close' : 'View'}
                      </span>
                    </button>

                    {expandedMacro === dish._id && (
                      <div className="mt-2 p-2.5 rounded-xl bg-black/40 border border-white/5 grid grid-cols-2 gap-2 text-center text-xs animate-fadeIn">
                        <div className="p-1 rounded bg-white/5">
                          <span className="block text-[10px] text-gray-400 font-medium">
                            Energy
                          </span>
                          <span className="font-black text-white text-xs">{dish.calories}</span>
                        </div>
                        <div className="p-1 rounded bg-white/5">
                          <span className="block text-[10px] text-gray-400 font-medium">
                            Protein
                          </span>
                          <span className="font-black text-[#10b981] text-xs">{dish.protein}</span>
                        </div>
                      </div>
                    )}

                    {/* Price & Action Button */}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Price
                        </span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-sm font-black text-[#ff5400]">₹</span>
                          <span className="text-2xl font-black text-white font-['Space_Grotesk']">
                            {dish.price}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(dish)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-xs transition-all duration-300 shadow-md ${
                          qty > 0
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-gradient-to-r from-[#ff5400] to-[#e11d48] hover:from-[#e04800] hover:to-[#cc163d] text-white shadow-[#ff5400]/25 hover:shadow-lg hover:shadow-[#ff5400]/40 active:scale-95'
                        }`}
                      >
                        <IoBagAdd className="text-base" />
                        <span>{qty > 0 ? `In Cart (${qty})` : 'Order Now'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#182032] via-[#121624] to-[#182032] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff5400] to-[#f59e0b] flex items-center justify-center text-white text-2xl shadow-lg shadow-[#ff5400]/30 shrink-0">
              <IoFlame />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-white font-['Space_Grotesk']">
                Craving custom culinary requests?
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                Connect directly with restaurant head chefs for curated banquet or dietary
                requirements.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/order-now')}
            className="px-6 py-3 rounded-2xl bg-white text-gray-900 font-black text-xs hover:bg-[#faf6f0] hover:shadow-lg transition-all duration-300 whitespace-nowrap active:scale-95"
          >
            Explore Full Master Menu →
          </button>
        </div>
      </div>
    </section>
  );
};

export default SignatureDishesShowcase;

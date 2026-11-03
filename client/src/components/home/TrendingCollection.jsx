import React from 'react';
import {
  IoFlame,
  IoTrendingUpOutline,
  IoTimeOutline,
  IoBagAdd,
  IoFlash,
  IoHeartOutline,
} from 'react-icons/io5';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const trendingDishes = [
  {
    _id: 'trend-01',
    restaurantId: 'rest-trend-01',
    restaurantName: 'Kyoto Ramen Bar',
    name: 'Rich Black Garlic Tonkotsu Ramen',
    price: 389,
    ordersToday: 342,
    rating: 4.9,
    deliveryTime: '24 mins',
    badge: 'VIRAL #1 ON SOCIAL',
    badgeColor: 'from-[#ff5400] to-[#e11d48]',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    description:
      '20-hour simmered broth, melt-in-mouth chashu pork, seasoned ajitsuke tamago, roasted nori & scallions.',
  },
  {
    _id: 'trend-02',
    restaurantId: 'rest-trend-02',
    restaurantName: 'The Mexican Cantina',
    name: 'Crispy Birria Quesa-Tacos with Consomé',
    price: 369,
    ordersToday: 288,
    rating: 4.88,
    deliveryTime: '20 mins',
    badge: 'LATE NIGHT HIT',
    badgeColor: 'from-[#f59e0b] to-[#ff5400]',
    image:
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    description:
      'Slow-braised spiced beef stuffed into melted Oaxaca cheese corn tortillas, served with rich dipping bone broth.',
  },
  {
    _id: 'trend-03',
    restaurantId: 'rest-trend-03',
    restaurantName: 'Artisan Wood Bakery',
    name: 'Pistachio Cream Supreme Croissant Roll',
    price: 249,
    ordersToday: 215,
    rating: 4.96,
    deliveryTime: '18 mins',
    badge: 'BAKERY SENSATION',
    badgeColor: 'from-[#10b981] to-[#047857]',
    image:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    description:
      'Flaky multi-layered circular pastry filled with Sicilian pistachio silk cream, topped with crushed green nuts.',
  },
  {
    _id: 'trend-04',
    restaurantId: 'rest-trend-04',
    restaurantName: 'Seoul Street Box',
    name: 'Honey Butter Yangnyeom Fried Chicken',
    price: 399,
    ordersToday: 412,
    rating: 4.94,
    deliveryTime: '25 mins',
    badge: 'MOST RE-ORDERED',
    badgeColor: 'from-[#8b5cf6] to-[#ec4899]',
    image:
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    description:
      'Double-fried ultra-crispy Korean tenders glazed in wild honey, toasted sesame seeds, garlic butter & pickled radish.',
  },
];

const TrendingCollection = () => {
  const { handleAddToCart, cart } = useCart();
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-[#080a11] relative overflow-hidden border-b border-white/5">
      {/* Dynamic ambient radial lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#ff5400]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#f59e0b]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f59e0b] text-xs font-black tracking-widest uppercase mb-4">
              <IoTrendingUpOutline className="text-base" />
              <span>Section 05 • Real-time Demand Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
              Trending Across{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5400] to-[#f59e0b]">
                Your City
              </span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
              Calculated dynamically from thousands of active consumer orders. Guaranteed fresh,
              highly recommended, and fast-tracked on delivery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[#0e121d] border border-white/10 flex items-center gap-2 text-xs text-gray-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
              <span className="font-bold">Live Pulse • Updated 2m ago</span>
            </div>
          </div>
        </div>

        {/* Trending Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingDishes.map((dish) => {
            const inCartItem = cart.find((c) => c.item._id === dish._id);
            const qty = inCartItem ? inCartItem.quantity : 0;

            return (
              <div
                key={dish._id}
                className="group relative bg-[#0e121d] rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between"
              >
                {/* Photo & Overlays */}
                <div className="relative h-56 w-full overflow-hidden bg-black">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e121d] via-transparent to-black/40" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider text-white bg-gradient-to-r ${dish.badgeColor} shadow-md`}
                    >
                      {dish.badge}
                    </span>
                  </div>

                  {/* Delivery time pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-gray-300 border border-white/10 flex items-center gap-1">
                    <IoFlash className="text-[#f59e0b]" />
                    <span>{dish.deliveryTime}</span>
                  </div>

                  {/* Live order counter */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 flex items-center gap-1.5">
                    <IoFlame className="text-[#ff5400] text-sm animate-pulse" />
                    <span>{dish.ordersToday} ordered today</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {dish.restaurantName}
                    </span>
                    <h3 className="text-lg font-black text-white font-['Space_Grotesk'] mt-1 group-hover:text-[#ff5400] transition-colors leading-snug">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Price
                      </span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs font-black text-[#ff5400]">₹</span>
                        <span className="text-xl font-black text-white font-['Space_Grotesk']">
                          {dish.price}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(dish)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-300 ${
                        qty > 0
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                          : 'bg-white hover:bg-gray-100 text-gray-900 active:scale-95 shadow-md'
                      }`}
                    >
                      <IoBagAdd className="text-sm" />
                      <span>{qty > 0 ? `Added (${qty})` : 'Quick Order'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingCollection;

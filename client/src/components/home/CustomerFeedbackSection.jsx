import React from 'react';
import { IoStar, IoCheckmarkCircle } from 'react-icons/io5';

const reviews = [
  {
    name: 'Aarav Sharma',
    city: 'Mumbai',
    role: 'Verified Foodie',
    avatar:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    dish: 'Smash Truffle Burger & Fries',
    quote:
      'The food arrived piping hot within 24 minutes! The live GPS tracking is so accurate and the packaging was completely spill-proof. Cravings has replaced all my other delivery apps.',
  },
  {
    name: 'Sneha Patel',
    city: 'Bengaluru',
    role: 'Verified Foodie',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    dish: 'Paneer Butter Masala & Garlic Naan',
    quote:
      'The restaurant discovery is unmatched. Found a hidden artisanal bakery 2km away that I now order from every weekend. Smooth checkout and instant receipt download too!',
  },
  {
    name: 'Rohan Verma',
    city: 'Delhi NCR',
    role: 'Verified Foodie',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    dish: 'Dim Sum Box & Boba Tea',
    quote:
      'Cravings delivery pooling is genius. Ordered together with colleagues in our tech park, got free delivery, and our meals all arrived simultaneously. 10/10 culinary experience.',
  },
];

const CustomerFeedbackSection = () => {
  return (
    <section className="bg-white dark:bg-[#0f1117] py-16 md:py-24 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#ff5200] bg-orange-50 dark:bg-orange-950/40 px-3.5 py-1.5 rounded-full border border-orange-200/60 dark:border-orange-900/40 inline-flex items-center gap-1.5 mb-3">
            <IoStar className="text-amber-500" /> 4.9 / 5 Rating from 120,000+ Orders
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Loved by Food Lovers Everywhere
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 font-medium">
            Real experiences from foodies enjoying restaurant-quality dining delivered to their
            doors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-[#faf9f6] dark:bg-gray-800/80 rounded-3xl p-7 border border-gray-150/70 dark:border-gray-700/60 shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & Dish badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <IoStar key={i} size={17} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200 dark:border-emerald-900/30">
                    <IoCheckmarkCircle size={12} /> {review.role}
                  </span>
                </div>

                {/* Dish tag */}
                <div className="mb-4">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700/60 px-2.5 py-1 rounded-lg border border-gray-200/60 dark:border-gray-600/50 inline-block">
                    🍴 {review.dish}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-6 italic">
                  "{review.quote}"
                </p>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[#ff5200]/30 shadow-xs"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                    {review.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {review.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerFeedbackSection;

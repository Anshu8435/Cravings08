import React from 'react';
import { FaHeart, FaTimes, FaShoppingCart, FaFire, FaLeaf, FaMotorcycle, FaExclamationTriangle } from 'react-icons/fa';

const DishCard = ({ dish, isFlipped, handleSwipe, addToCart }) => {
  if (!dish) return null;

  return (
    <div className={`w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
      {/* Front */}
      <div className="absolute inset-0 [-webkit-backface-visibility:hidden] [backface-visibility:hidden] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col z-10">
        {/* Dish Image */}
        <div className="relative h-1/2 w-full bg-gray-200">
          <img
            src={dish.image?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"}
            alt={dish.itemName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            {dish.isNew && (
              <span className="bg-blue-500 text-white px-2 py-1 flex items-center justify-center rounded-full shadow-lg text-xs font-black tracking-wider" title="New Item">
                NEW
              </span>
            )}
            {dish.type === "Vegetarian" && (
              <span className="bg-green-500 text-white p-2 rounded-full shadow-lg" title="Vegetarian">
                <FaLeaf />
              </span>
            )}
            {dish.isTopRated && (
              <span className="bg-orange-500 text-white p-2 rounded-full shadow-lg" title="Top Rated">
                <FaFire />
              </span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 pt-12">
            <h2 className="text-3xl font-extrabold text-white mb-1">{dish.itemName}</h2>
            <p className="text-white/80 font-medium">{dish.restaurantName || "Unknown Restaurant"}</p>
          </div>
        </div>

        {/* Dish Details & Macros */}
        <div className="flex-1 p-6 flex flex-col bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-(--color-primary)">₹{dish.price}</span>
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
              ★ {dish.rating || "4.5"}
            </div>
          </div>

          {/* Macro & Travel Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800/50 text-[11px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
              🔥 {dish.macros?.calories || 0} Cal
            </span>
            <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 text-[11px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
              💪 {dish.macros?.protein || 0}g Pro
            </span>
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 text-[11px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
              🍞 {dish.macros?.carbs || 0}g Carb
            </span>
            <span className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800/50 text-[11px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
              🥑 {dish.macros?.fats || 0}g Fat
            </span>
            {dish.travelScore !== undefined && (
              <span className={`border text-xs font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 ${dish.travelScore >= 80 ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50' :
                  dish.travelScore >= 60 ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/50' :
                    'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50'
                }`}>
                <FaMotorcycle /> Travel: {dish.travelScore}/100
                {dish.travelScore < 60 && <FaExclamationTriangle className="ml-0.5" title="Melts or spills easily" />}
              </span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
            {dish.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-auto flex justify-center gap-6 pb-2">
            <button
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 rounded-full bg-white dark:bg-gray-700 shadow-xl flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-gray-600 transition-all hover:scale-110 border border-gray-100 dark:border-gray-600"
            >
              <FaTimes size={24} />
            </button>
            <button
              onClick={addToCart}
              className="w-14 h-14 rounded-full bg-(--color-primary) text-white shadow-xl shadow-orange-500/30 flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-110 self-end mb-2"
            >
              <FaShoppingCart size={20} />
            </button>
            <button
              onClick={() => handleSwipe('right')}
              className="w-16 h-16 rounded-full bg-white dark:bg-gray-700 shadow-xl flex items-center justify-center text-green-500 hover:bg-green-50 dark:hover:bg-gray-600 transition-all hover:scale-110 border border-gray-100 dark:border-gray-600"
            >
              <FaHeart size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="absolute inset-0 [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)] w-full h-full bg-gray-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-gray-700 p-6 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-extrabold mb-6 text-(--color-primary) text-center">{dish.itemName}</h2>
        <div className="w-full bg-black/40 rounded-xl p-5 mb-4 border border-gray-700">
          <div className="flex justify-between border-b border-white/10 pb-3 mb-3">
            <span className="text-gray-400 uppercase text-sm font-bold tracking-wider">Calories</span>
            <span className="font-bold text-lg text-orange-400">{dish.macros?.calories || 0} kcal</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3 mb-3">
            <span className="text-gray-400 uppercase text-sm font-bold tracking-wider">Protein</span>
            <span className="font-bold text-lg text-emerald-400">{dish.macros?.protein || 0} g</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3 mb-3">
            <span className="text-gray-400 uppercase text-sm font-bold tracking-wider">Carbs</span>
            <span className="font-bold text-lg">{dish.macros?.carbs || 0} g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 uppercase text-sm font-bold tracking-wider">Fats</span>
            <span className="font-bold text-lg">{dish.macros?.fats || 0} g</span>
          </div>
        </div>
        <p className="text-center text-sm text-gray-400 leading-relaxed mt-2 mb-4 overflow-y-auto max-h-32">
          {dish.description}
        </p>

        {/* Action Buttons */}
        <div className="mt-auto flex justify-center gap-6 pb-2 w-full">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-gray-800 shadow-xl flex items-center justify-center text-red-500 hover:bg-gray-700 transition-all hover:scale-110 border border-gray-700"
          >
            <FaTimes size={24} />
          </button>
          <button
            onClick={addToCart}
            className="w-14 h-14 rounded-full bg-(--color-primary) text-white shadow-xl shadow-orange-500/30 flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-110 self-end mb-2"
          >
            <FaShoppingCart size={20} />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-gray-800 shadow-xl flex items-center justify-center text-green-500 hover:bg-gray-700 transition-all hover:scale-110 border border-gray-700"
          >
            <FaHeart size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;

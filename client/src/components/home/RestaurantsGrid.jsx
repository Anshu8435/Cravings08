import React from 'react';
import { IoStar, IoTimeOutline, IoLocationOutline } from 'react-icons/io5';
import CravingFeed from '../../components/CravingFeed';

const RestaurantsGrid = ({
  viewMode,
  setViewMode,
  loading,
  filteredRestaurants,
  navigate,
  selectedCategory,
  categories,
  setSearchQuery,
  setSelectedCategory,
}) => {
  return (
    <section
      id="restaurants-section"
      className="py-12 md:py-20 bg-[#faf9f6] dark:bg-[#0c0e14] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Segmented Control View Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800/80 p-1.5 rounded-2xl inline-flex shadow-sm border border-gray-150/70 dark:border-gray-700">
            <button
              onClick={() => setViewMode('restaurants')}
              className={`px-7 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${
                viewMode === 'restaurants'
                  ? 'bg-linear-to-r from-[#ff5200] to-[#f97316] text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>🏢</span> Featured Restaurants
            </button>
            <button
              onClick={() => setViewMode('feed')}
              className={`px-7 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${
                viewMode === 'feed'
                  ? 'bg-linear-to-r from-[#ff5200] to-[#f97316] text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>🔥</span> Craving Feed
            </button>
          </div>
        </div>

        {viewMode === 'feed' ? (
          <div className="mb-16">
            <CravingFeed />
          </div>
        ) : (
          <div>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[#ff5200] font-black tracking-widest text-xs uppercase mb-1 block">
                  Top Curated Kitchens
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  {selectedCategory === 'all'
                    ? 'Explore Restaurants Near You'
                    : `${categories.find((c) => c.id === selectedCategory)?.label} Specialities`}
                </h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                Showing{' '}
                <span className="font-extrabold text-gray-800 dark:text-gray-200">
                  {filteredRestaurants.length}
                </span>{' '}
                verified outlets
              </p>
            </div>

            {/* Restaurants Grid or Skeletons */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((sk) => (
                  <div
                    key={sk}
                    className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse"
                  >
                    <div className="h-56 bg-gray-200 dark:bg-gray-700 w-full" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => navigate(`/restaurant-details/${restaurant.id}`)}
                    className="group flex flex-col bg-white dark:bg-gray-800/90 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-gray-150/70 dark:border-gray-700/60 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Restaurant Cover Image */}
                    <div className="relative h-60 overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                      {/* Gradient Vignette for Text Legibility */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black tracking-wide shadow-md flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          OPEN NOW
                        </span>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-black shadow-lg text-gray-900 dark:text-white">
                        <IoStar className="text-amber-400 fill-amber-400" size={15} />
                        {restaurant.rating.toFixed(1)}
                      </div>

                      {/* Bottom Banner Content */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-extrabold text-2xl drop-shadow-md leading-tight group-hover:text-orange-300 transition-colors">
                          {restaurant.name}
                        </h3>
                        <p className="text-xs text-white/80 font-medium flex items-center gap-1 mt-1">
                          <IoLocationOutline size={14} className="text-orange-400" />
                          {restaurant.city || 'Downtown'}
                        </p>
                      </div>
                    </div>

                    {/* Restaurant Body Information */}
                    <div className="flex flex-col flex-1 p-6">
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {restaurant.description}
                      </p>

                      {/* Cuisines Tag Pills */}
                      <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                        {restaurant.cuisines
                          ? restaurant.cuisines
                              .split(',')
                              .slice(0, 3)
                              .map((cuisine, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-orange-50 dark:bg-orange-950/30 text-[#ff5200] dark:text-orange-400 border border-orange-100 dark:border-orange-900/40 px-2.5 py-1 rounded-lg font-bold capitalize"
                                >
                                  {cuisine.trim()}
                                </span>
                              ))
                          : null}
                      </div>

                      {/* Card Footer with CTA */}
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          <IoTimeOutline size={16} className="text-[#ff5200]" />
                          <span>25-35 mins</span>
                        </div>
                        <span className="text-sm font-black text-[#ff5200] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          View Menu →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm max-w-lg mx-auto">
                <span className="text-5xl mb-4 block">🔍</span>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  No restaurants found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Try adjusting your search keywords or browsing all categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="bg-[#ff5200] text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#e04800] transition"
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

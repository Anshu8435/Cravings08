import React from 'react';

const categoriesData = [
  { id: 'all', label: 'All Curations', icon: '✨', count: '50+' },
  { id: 'pizza', label: 'Wood-Fired Pizza', icon: '🍕', count: '18 Kitchens' },
  { id: 'burgers', label: 'Artisanal Burgers', icon: '🍔', count: '14 Kitchens' },
  { id: 'dimsum', label: 'Dim Sum & Bao', icon: '🥟', count: '12 Kitchens' },
  { id: 'veg', label: 'Plant-Based / Veg', icon: '🥗', count: '22 Kitchens' },
  { id: 'biryani', label: 'Royal Biryani', icon: '🥘', count: '16 Kitchens' },
  { id: 'dessert', label: 'French Patisserie', icon: '🍰', count: '9 Kitchens' },
  { id: 'beverages', label: 'Artisan Boba & Brew', icon: '🧋', count: '8 Outlets' },
];

const FoodCategories3D = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <section className="bg-[#080a11] py-8 border-y border-white/10 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5400] animate-ping" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              Curated Taste Categories
            </h3>
          </div>
          <span className="text-xs font-bold text-gray-500 hidden sm:inline">
            Scroll horizontally to explore
          </span>
        </div>

        {/* 3D Elevated Category Pill Slider */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 custom-scrollbar scroll-smooth">
          {categoriesData.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  document
                    .getElementById('restaurants-section')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 transform active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white border-transparent shadow-lg shadow-[#ff5400]/30 -translate-y-1'
                    : 'bg-[#0e121d] hover:bg-[#161c2c] text-gray-300 border-white/10 hover:border-white/20 hover:-translate-y-0.5'
                }`}
              >
                <span className="text-xl group-hover:scale-125 transition-transform duration-300">
                  {cat.icon}
                </span>
                <div className="text-left">
                  <span className="block text-xs font-extrabold tracking-tight leading-tight">
                    {cat.label}
                  </span>
                  <span
                    className={`block text-[10px] font-bold ${
                      isActive ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FoodCategories3D;

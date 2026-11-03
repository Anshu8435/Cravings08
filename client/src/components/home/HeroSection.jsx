import React from 'react';
import {
  IoSearch,
  IoSparkles,
  IoFlame,
  IoArrowForward,
  IoTimeOutline,
  IoLocationOutline,
} from 'react-icons/io5';
import CulinaryShowcaseHero from './CulinaryShowcaseHero';

const HeroSection = ({
  user,
  navigate,
  setViewMode,
  searchQuery,
  setSearchQuery,
  handleNavigateToDashboard,
}) => {
  return (
    <section className="relative bg-[#080a11] text-white overflow-hidden pt-6 pb-16 lg:py-16 transition-colors">
      {/* Background Ambient Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#ff5400]/15 via-[#e11d48]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[420px] h-[420px] rounded-full bg-gradient-to-tl from-[#f59e0b]/15 to-transparent blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Masterpiece Headline & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Live Telemetry Radar Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-300">
                Live Kitchen Radar • 24 Min Avg Delivery
              </span>
              <span className="text-[#ff5400] text-xs font-black">⚡ Express</span>
            </div>

            {/* Giant Editorial Headline */}
            <div className="space-y-2">
              <span className="block text-xs font-black uppercase tracking-[0.25em] text-[#ff5400]">
                Beyond Ordinary Taste
              </span>
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                CRAVINGS
                <span className="block text-2xl sm:text-4xl xl:text-5xl font-editorial font-light italic mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-[#ff5400]">
                  Where Every Bite Becomes an Experience.
                </span>
              </h1>
            </div>

            {/* Editorial Description */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-xl font-normal leading-relaxed">
              Curating award-winning kitchens, cloud culinary laboratories, and iconic street
              masterminds delivered hot at 65°C doorstep temperature in under 30 minutes.
            </p>

            {/* Interactive Search Bar */}
            <div className="max-w-xl">
              <div className="flex items-center bg-[#0e121d]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-2xl focus-within:border-[#ff5400] focus-within:ring-2 focus-within:ring-[#ff5400]/25 transition-all">
                <IoSearch className="text-[#ff5400] text-2xl ml-3 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search artisanal pizza, smash burgers, truffle bowls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-white placeholder-gray-500 text-sm sm:text-base font-medium"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setViewMode('restaurants');
                      document
                        .getElementById('restaurants-section')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white px-5 py-2.5 rounded-xl font-black text-xs hover:opacity-95 transition-all shrink-0"
                  >
                    <span>Search</span>
                    <IoArrowForward size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setViewMode('restaurants');
                  document
                    .getElementById('restaurants-section')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#ff5400] via-[#e11d48] to-[#be123c] hover:opacity-95 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-[#ff5400]/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
              >
                <span>Explore 3D Menu</span>
                <IoArrowForward className="group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setViewMode('feed');
                  document
                    .getElementById('restaurants-section')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-7 py-4 rounded-2xl font-bold text-sm backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Interactive Craving Feed</span>
                <IoFlame className="text-[#ff5400]" size={18} />
              </button>
            </div>

            {/* Social Proof Stack */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10 max-w-lg">
              <div className="flex -space-x-2.5">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop',
                ].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Foodie"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#080a11]"
                  />
                ))}
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-white block">500,000+ Happy Foodies</span>
                <span className="text-gray-400">Delivering in 25+ Metro Hubs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Signature Culinary Showcase Stage Centerpiece (5 Cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <CulinaryShowcaseHero />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import React from 'react';
import { IoStorefrontOutline, IoBicycleOutline, IoArrowForward } from 'react-icons/io5';

const CTASection = ({ navigate, user, handleNavigateToDashboard }) => {
  return (
    <section className="bg-[#faf9f6] dark:bg-[#0c0e14] py-16 md:py-24 border-t border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Restaurant Partner */}
          <div className="relative rounded-3xl bg-linear-to-br from-orange-500 via-[#ff5200] to-[#e04800] p-8 md:p-10 text-white shadow-xl shadow-orange-500/20 overflow-hidden flex flex-col justify-between group">
            {/* Ambient Background Graphic */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white mb-6 shadow-sm border border-white/20">
                <IoStorefrontOutline size={30} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white inline-block mb-3">
                Kitchen Onboarding
              </span>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
                Grow Your Restaurant with Cravings
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-8 max-w-md">
                Connect with thousands of hungry foodies in your city. Enjoy 0% commission on your
                first 30 days and smart kitchen management tools.
              </p>
            </div>

            <div>
              {!user ? (
                <button
                  onClick={() => navigate('/register/restaurant')}
                  className="bg-white text-[#ff5200] px-6 py-3.5 rounded-2xl font-black text-sm shadow-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group/btn"
                >
                  <span>Partner With Us</span>
                  <IoArrowForward className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handleNavigateToDashboard}
                  className="bg-white text-[#ff5200] px-6 py-3.5 rounded-2xl font-black text-sm shadow-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Go to Dashboard</span>
                  <IoArrowForward />
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Rider Partner */}
          <div className="relative rounded-3xl bg-linear-to-br from-[#1a1e29] via-[#141721] to-[#0f1118] p-8 md:p-10 text-white shadow-xl shadow-black/20 border border-gray-800 overflow-hidden flex flex-col justify-between group">
            {/* Ambient Background Graphic */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#ff5200]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#ff5200]/20 border border-[#ff5200]/30 flex items-center justify-center text-[#ff5200] mb-6 shadow-sm">
                <IoBicycleOutline size={30} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider bg-[#ff5200]/20 text-[#ff5200] border border-[#ff5200]/30 px-3 py-1 rounded-full inline-block mb-3">
                Flexible Earnings
              </span>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
                Deliver & Earn on Your Schedule
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-md">
                Earn competitive weekly payouts with flexible delivery hours. Get 100% of customer
                tips, safety gear, and dedicated courier support.
              </p>
            </div>

            <div>
              {!user ? (
                <button
                  onClick={() => navigate('/register/rider')}
                  className="bg-linear-to-r from-[#ff5200] to-[#f97316] text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-orange-500/25 hover:opacity-95 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group/btn"
                >
                  <span>Become a Rider</span>
                  <IoArrowForward className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handleNavigateToDashboard}
                  className="bg-[#ff5200] text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-lg hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Go to Dashboard</span>
                  <IoArrowForward />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

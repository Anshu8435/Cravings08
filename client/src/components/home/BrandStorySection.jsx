import React from 'react';
import { IoSparklesOutline, IoCheckmarkDoneCircle, IoRibbonOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const BrandStorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-[#0e121d] relative overflow-hidden border-b border-white/5">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#ff5400]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition with Layered Images */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                  alt="Culinary Kitchen Artistry"
                  className="w-full h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5400]/20 border border-[#ff5400]/40 text-[#ff5400] text-xs font-bold mb-2">
                    <IoRibbonOutline /> Atelier Kitchen Standards
                  </div>
                  <h4 className="text-white font-['Space_Grotesk'] font-black text-lg">
                    Every plate crafted with surgical precision
                  </h4>
                </div>
              </div>

              {/* Floating Chef Quote Card */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-[#182032]/95 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-2xl max-w-xs hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&q=80"
                    alt="Head Chef"
                    className="w-10 h-10 rounded-full object-cover border border-[#ff5400]"
                  />
                  <div>
                    <span className="block text-xs font-black text-white">Chef Marco Valenti</span>
                    <span className="block text-[10px] text-gray-400">
                      Head of Culinary Innovation
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-300 italic leading-snug">
                  "Fine food should never lose its soul in transit. We treat delivery as an art
                  form."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/30 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-4">
              <IoSparklesOutline className="text-sm" />
              <span>Section 09 • The Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight leading-[1.15]">
              CRAVINGS — <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5400] via-[#f59e0b] to-[#e11d48]">
                Beyond Ordinary Taste.
              </span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-6">
              Most food delivery apps treat food as freight — piled into backpacks, arriving
              lukewarm, soggy, and devoid of freshness. We set out to change that forever.
            </p>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mt-4">
              At Cravings, we partnered directly with top-tier culinary masters, pastry artisans,
              and wood-fired pizzerias. Combining custom patented temperature lockers with real-time
              AI dispatch, your dish arrives exactly as the head chef intended: piping hot, crisp,
              and beautifully plated.
            </p>

            {/* Core Values checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {[
                'Zero compromise on ingredient provenance',
                'Custom dual-chamber temperature locks',
                'Fair revenue share for local artisans',
                'Zero artificial dynamic fee surges',
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <IoCheckmarkDoneCircle className="text-[#10b981] text-lg shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-200">{point}</span>
                </div>
              ))}
            </div>

            {/* Interactive CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <button
                onClick={() => navigate('/about')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white font-black text-xs hover:shadow-lg hover:shadow-[#ff5400]/30 transition-all duration-300 active:scale-95"
              >
                Read Our Story & Journey →
              </button>
              <button
                onClick={() => navigate('/order-now')}
                className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs transition-all duration-300 active:scale-95"
              >
                Taste The Difference
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;

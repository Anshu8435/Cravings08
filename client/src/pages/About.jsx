import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUtensils,
  FaMotorcycle,
  FaStore,
  FaHeart,
  FaLeaf,
  FaShieldAlt,
  FaStar,
} from 'react-icons/fa';
import { IoSparklesOutline, IoTrophyOutline } from 'react-icons/io5';

const About = () => {
  return (
    <div className="bg-[#080a11] min-h-screen text-gray-100 font-sans selection:bg-[#ff5400] selection:text-white">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] min-h-[420px] flex items-center justify-center text-white bg-cover bg-center overflow-hidden border-b border-white/10"
        style={{ backgroundImage: "url('/aboutPage.png')" }}
      >
        <div className="absolute inset-0 bg-[#080a11]/80 backdrop-blur-sm" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#ff5400]/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl">
          <div className="bg-white/5 backdrop-blur-md p-2 rounded-full mb-5 ring-1 ring-white/20 shadow-2xl">
            <img
              src="/circleLogo.png"
              alt="Cravings Logo"
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5400]/15 border border-[#ff5400]/40 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-4">
            <IoSparklesOutline />
            <span>Beyond Ordinary Taste • The Manifesto</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight font-['Space_Grotesk']">
            Connecting Hearts with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5400] via-[#f59e0b] to-[#e11d48]">
              Culinary Artistry
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-medium max-w-2xl leading-relaxed">
            Reimagining food delivery as a high-precision culinary craft. Championing master chefs,
            sustainable kitchens, and thermal-locked velocity.
          </p>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-[#0e121d] py-10 border-b border-white/10 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-3xl md:text-4xl font-black font-['Space_Grotesk'] text-white mb-1">
                500K+
              </div>
              <div className="text-[11px] font-bold text-[#ff5400] uppercase tracking-wider">
                Happy Foodies
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-3xl md:text-4xl font-black font-['Space_Grotesk'] text-white mb-1">
                5,000+
              </div>
              <div className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider">
                Kitchen Partners
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-3xl md:text-4xl font-black font-['Space_Grotesk'] text-white mb-1">
                1,200+
              </div>
              <div className="text-[11px] font-bold text-[#10b981] uppercase tracking-wider">
                Active Couriers
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-3xl md:text-4xl font-black font-['Space_Grotesk'] text-white mb-1 flex justify-center items-center gap-1.5">
                <FaStar className="text-amber-400" /> 4.9
              </div>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-[#080a11]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-14 items-center">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/30 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-4">
                <IoTrophyOutline /> Our Genesis
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight font-['Space_Grotesk']">
                Born From an Obsession with Precision Dining
              </h2>
              <div className="text-gray-300 text-sm sm:text-base space-y-4 leading-relaxed">
                <p>
                  Cravings started when passionate gastronomers realized that ordinary food delivery
                  was plagued with soggy crusts, cold soups, hidden platform surcharges, and
                  sluggish routing.
                </p>
                <p>
                  We built Cravings from the ground up to solve that: proprietary dual-chamber 65°C
                  thermal cases, direct restaurant-to-customer AI corridor routing, and an
                  uncompromising commitment to culinary integrity.
                </p>
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div className="bg-[#131826] p-6 rounded-3xl border border-white/10 hover:border-[#ff5400]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#ff5400]/10 flex items-center justify-center text-[#ff5400] mb-4 text-xl">
                  <FaUtensils />
                </div>
                <h4 className="font-black text-white font-['Space_Grotesk'] text-base mb-1">
                  Artisan Kitchens
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Direct partnership with certified Michelin-trained chefs and authentic heritage
                  kitchens.
                </p>
              </div>

              <div className="bg-[#131826] p-6 rounded-3xl border border-white/10 hover:border-blue-500/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 text-xl">
                  <FaMotorcycle />
                </div>
                <h4 className="font-black text-white font-['Space_Grotesk'] text-base mb-1">
                  Thermal Couriers
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Active 65°C temperature lockers ensure your meal arrives at peak kitchen
                  freshness.
                </p>
              </div>

              <div className="bg-[#131826] p-6 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 text-xl">
                  <FaStore />
                </div>
                <h4 className="font-black text-white font-['Space_Grotesk'] text-base mb-1">
                  Ethical Revenue
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Fair commission splits with 0% predatory markups, supporting local culinary
                  creators.
                </p>
              </div>

              <div className="bg-[#131826] p-6 rounded-3xl border border-white/10 hover:border-rose-500/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-4 text-xl">
                  <FaHeart />
                </div>
                <h4 className="font-black text-white font-['Space_Grotesk'] text-base mb-1">
                  Obsessive Quality
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every order backed by real-time dish travel scores and instant kitchen
                  satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-[#0e121d] border-y border-white/10">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b] text-xs font-black tracking-widest uppercase mb-4">
            <IoSparklesOutline /> Core Beliefs
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-14 tracking-tight font-['Space_Grotesk']">
            Principles We Cook By
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#131826] p-8 rounded-3xl border border-white/10 text-left hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#ff5400]/10 flex items-center justify-center text-[#ff5400] mb-5">
                <FaHeart size={22} />
              </div>
              <h4 className="text-xl font-black text-white font-['Space_Grotesk'] mb-3">
                Uncompromising Flavour
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Great food is sensory architecture. Every recipe on our platform is vetted for
                crunch, aroma, and thermodynamic stability.
              </p>
            </div>

            <div className="bg-[#131826] p-8 rounded-3xl border border-white/10 text-left hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-5">
                <FaLeaf size={22} />
              </div>
              <h4 className="text-xl font-black text-white font-['Space_Grotesk'] mb-3">
                Fresh & Farm-Traced
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Direct farm provenance, non-GMO produce, and verified organic ingredients wherever
                indicated by our partner artisans.
              </p>
            </div>

            <div className="bg-[#131826] p-8 rounded-3xl border border-white/10 text-left hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5">
                <FaShieldAlt size={22} />
              </div>
              <h4 className="text-xl font-black text-white font-['Space_Grotesk'] mb-3">
                Verified & Reliable
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Military-grade 256-bit payment encryption, live telemetry GPS radar, and verified
                courier background checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#182032] via-[#121624] to-[#182032] text-white text-center border-b border-white/10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight font-['Space_Grotesk']">
            Ready to Taste Extraordinary?
          </h2>
          <p className="text-sm sm:text-base mb-8 text-gray-300 font-medium">
            Join discerning food lovers enjoying chef-crafted master meals delivered in under 25
            minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/order-now"
              className="px-8 py-3.5 bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white font-black rounded-2xl shadow-xl shadow-[#ff5400]/25 hover:scale-105 active:scale-95 transition-all text-sm"
            >
              Order Gourmet Now →
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

import React from 'react';
import {
  IoShieldCheckmarkOutline,
  IoSpeedometerOutline,
  IoThermometerOutline,
  IoVideocamOutline,
  IoDiamondOutline,
} from 'react-icons/io5';

const features = [
  {
    step: '01',
    icon: IoThermometerOutline,
    title: 'Active Thermal Lockers',
    description:
      'Every courier bike is equipped with dual-chamber 65°C heated thermal compartments and sub-zero chill boxes, guaranteeing kitchen-fresh temperature.',
    tag: 'TEMPERATURE LOCKED',
    color: 'text-[#ff5400]',
    bgColor: 'bg-[#ff5400]/10',
    borderColor: 'group-hover:border-[#ff5400]/40',
  },
  {
    step: '02',
    icon: IoSpeedometerOutline,
    title: 'AI Corridor Routing',
    description:
      'Our proprietary spatial clustering engine analyzes traffic congestion every 15 seconds to steer couriers through the fastest hyper-local pathways.',
    tag: '< 25 MIN AVERAGE',
    color: 'text-[#f59e0b]',
    bgColor: 'bg-[#f59e0b]/10',
    borderColor: 'group-hover:border-[#f59e0b]/40',
  },
  {
    step: '03',
    icon: IoShieldCheckmarkOutline,
    title: '0% Hidden Surge Fees',
    description:
      'Completely honest, transparent fee structure. No rainy day surges, no inflated packaging markups, and fair payouts for partner chefs.',
    tag: 'ETHICAL PRICING',
    color: 'text-[#10b981]',
    bgColor: 'bg-[#10b981]/10',
    borderColor: 'group-hover:border-[#10b981]/40',
  },
  {
    step: '04',
    icon: IoVideocamOutline,
    title: 'Kitchen Cam Verification',
    description:
      'Inspect hygiene standards before you order. 100% verified FSSAI licenses with real-time sanitized prep confirmation on every delivery.',
    tag: 'FSSAI CERTIFIED',
    color: 'text-[#8b5cf6]',
    bgColor: 'bg-[#8b5cf6]/10',
    borderColor: 'group-hover:border-[#8b5cf6]/40',
  },
];

const WhyChooseCravings = () => {
  return (
    <section className="py-24 bg-[#080a11] relative overflow-hidden border-b border-white/5">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#ff5400]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-4">
              <IoDiamondOutline className="text-sm" />
              <span>Section 08 • The Food-Tech Standard</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
              Engineered For{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5400] to-[#f59e0b]">
                Culinary Perfection
              </span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
              We reimagined the food delivery lifecycle from prep to doorstep. Precision logistics
              engineered to preserve flavour, crunch, and aroma.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div>
              <span className="block text-2xl font-black text-white font-['Space_Grotesk']">
                99.4%
              </span>
              <span className="text-xs">On-Time Rate</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="block text-2xl font-black text-white font-['Space_Grotesk']">
                65°C
              </span>
              <span className="text-xs">Thermal Lock</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="block text-2xl font-black text-white font-['Space_Grotesk']">
                4.9/5
              </span>
              <span className="text-xs">Food Quality</span>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`group relative bg-[#0e121d] rounded-3xl p-7 border border-white/10 ${item.borderColor} transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center ${item.color} text-2xl border border-white/5 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon />
                    </div>
                    <span className="text-2xl font-black font-['Space_Grotesk'] text-white/20 group-hover:text-white/40 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase mb-3 ${item.bgColor} ${item.color}`}
                  >
                    {item.tag}
                  </span>

                  <h3 className="text-lg font-black text-white font-['Space_Grotesk'] group-hover:text-[#ff5400] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                  <span>Learn protocol</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseCravings;

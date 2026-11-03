import React from 'react';
import {
  IoRocketOutline,
  IoHeartOutline,
  IoStorefrontOutline,
  IoFlashOutline,
} from 'react-icons/io5';

const stats = [
  {
    icon: IoRocketOutline,
    number: '2.5M+',
    label: 'Express Deliveries',
    description: 'Hot meals delivered with 28-min average turnaround',
    glowColor: 'from-orange-500/20 to-amber-500/5',
    iconBg: 'bg-orange-50 text-[#ff5200] dark:bg-orange-950/30',
  },
  {
    icon: IoHeartOutline,
    number: '500K+',
    label: 'Delighted Foodies',
    description: '4.8-star platform satisfaction across all cities',
    glowColor: 'from-rose-500/20 to-orange-500/5',
    iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/30',
  },
  {
    icon: IoStorefrontOutline,
    number: '5,000+',
    label: 'Curated Kitchens',
    description: 'From local iconic street bistros to Michelin chefs',
    glowColor: 'from-amber-500/20 to-yellow-500/5',
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30',
  },
  {
    icon: IoFlashOutline,
    number: '1,200+',
    label: 'Verified Riders',
    description: 'AI-pooled smart routes ensuring doorstep speed',
    glowColor: 'from-blue-500/20 to-cyan-500/5',
    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30',
  },
];

const StatisticsSection = () => {
  return (
    <section className="bg-[#faf9f6] dark:bg-[#0c0e14] py-16 md:py-24 border-y border-gray-100 dark:border-gray-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#ff5200] bg-orange-50 dark:bg-orange-950/40 px-3.5 py-1.5 rounded-full border border-orange-200/60 dark:border-orange-900/40 inline-block mb-3">
            Scale & Reliability
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Cravings by the Numbers
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 font-medium">
            Powering millions of culinary cravings with enterprise-grade speed and reliability
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white dark:bg-gray-800/90 rounded-3xl p-7 shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-700/60 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Ambient Top Glow */}
                <div
                  className={`absolute -top-10 -right-10 w-28 h-28 bg-linear-to-br ${stat.glowColor} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}
                ></div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center text-xl font-bold shadow-xs`}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 group-hover:text-[#ff5200] transition-colors">
                      Live Metric
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                    <span className="bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
                      {stat.number}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-900 dark:text-gray-100 mb-1.5">
                    {stat.label}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Subtle bottom indicator */}
                <div className="w-8 h-1 bg-gray-100 dark:bg-gray-700 rounded-full mt-6 group-hover:w-full group-hover:bg-[#ff5200] transition-all duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;

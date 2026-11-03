import React, { useState } from 'react';
import {
  IoPricetagOutline,
  IoCopyOutline,
  IoCheckmarkCircle,
  IoSparkles,
  IoGiftOutline,
  IoFlashOutline,
} from 'react-icons/io5';
import toast from 'react-hot-toast';

const vouchers = [
  {
    code: 'WELCOME100',
    discount: '₹100 FLAT OFF',
    title: 'First Taste Welcome Gift',
    description: 'Applicable on your premier order above ₹399 across all gourmet kitchens.',
    tag: 'NEW MEMBER SPECIAL',
    accent: 'from-[#ff5400] to-[#e11d48]',
    borderGlow: 'hover:border-[#ff5400]',
    minSpend: 'Min ₹399',
    expires: 'Today midnight',
  },
  {
    code: 'CRAVINGS50',
    discount: '50% INSTANT OFF',
    title: 'Artisan Chef Pass',
    description:
      'Enjoy 50% off up to ₹150 with zero delivery surge fees on top-rated master kitchens.',
    tag: 'MOST POPULAR',
    accent: 'from-[#f59e0b] to-[#ff5400]',
    borderGlow: 'hover:border-[#f59e0b]',
    minSpend: 'Min ₹299',
    expires: 'Limited 100 uses',
  },
  {
    code: 'GOURMETVIP',
    discount: 'FREE DESSERT + 20%',
    title: 'Michelin VIP Privilege',
    description: 'Complimentary Valrhona lava cake or artisan beverage on orders above ₹799.',
    tag: 'VIP EXCLUSIVE',
    accent: 'from-[#8b5cf6] to-[#ec4899]',
    borderGlow: 'hover:border-[#8b5cf6]',
    minSpend: 'Min ₹799',
    expires: 'Ends this Sunday',
  },
];

const SpecialOffersSection = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  return (
    <section className="py-24 bg-[#0e121d] relative overflow-hidden border-b border-white/5">
      {/* Background glow elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#ff5400]/10 via-[#f59e0b]/10 to-[#e11d48]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] text-xs font-black tracking-widest uppercase mb-4">
            <IoGiftOutline className="text-base" />
            <span>Section 07 • Privilege & Vouchers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            Exclusive{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5400] via-[#f59e0b] to-[#e11d48]">
              Dining Perks
            </span>
          </h2>
          <p className="text-gray-400 mt-3 text-sm sm:text-base leading-relaxed">
            Unlock premium hospitality discounts. Copy the access code below and apply at checkout
            for instant luxury savings.
          </p>
        </div>

        {/* Voucher Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vouchers.map((voucher) => {
            const isCopied = copiedCode === voucher.code;

            return (
              <div
                key={voucher.code}
                className={`group relative bg-[#131826] rounded-3xl p-6 sm:p-7 border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between ${voucher.borderGlow}`}
              >
                {/* Accent top gradient line */}
                <div
                  className={`absolute top-0 left-8 right-8 h-1 rounded-b bg-gradient-to-r ${voucher.accent}`}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider text-white bg-white/10 uppercase">
                      {voucher.tag}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                      <IoFlashOutline className="text-[#f59e0b]" />
                      {voucher.expires}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk'] tracking-tight">
                    {voucher.discount}
                  </h3>
                  <h4 className="text-sm font-bold text-gray-200 mt-1">{voucher.title}</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {voucher.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-dashed border-white/10">
                  <div className="flex items-center justify-between mb-3 text-[11px] text-gray-400">
                    <span>Eligibility</span>
                    <span className="font-bold text-white">{voucher.minSpend}</span>
                  </div>

                  {/* Copy Coupon Box */}
                  <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-1.5 pl-4">
                    <div className="flex items-center gap-2">
                      <IoPricetagOutline className="text-[#ff5400] text-sm" />
                      <span className="font-mono font-black text-white text-sm tracking-widest">
                        {voucher.code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(voucher.code)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                        isCopied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white hover:bg-gray-100 text-gray-950 active:scale-95'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <IoCheckmarkCircle className="text-sm" />
                          <span>COPIED!</span>
                        </>
                      ) : (
                        <>
                          <IoCopyOutline className="text-sm" />
                          <span>COPY CODE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;

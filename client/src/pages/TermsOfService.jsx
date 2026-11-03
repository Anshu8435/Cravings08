import React, { useState } from 'react';
import {
  FaUser,
  FaCreditCard,
  FaMotorcycle,
  FaUtensils,
  FaBan,
  FaBalanceScale,
  FaTimesCircle,
  FaFileContract,
  FaEnvelope,
} from 'react-icons/fa';
import { IoSparklesOutline, IoDocumentTextOutline } from 'react-icons/io5';

const TermsOfService = () => {
  const [openSection, setOpenSection] = useState(0);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      title: 'User Accounts & Access',
      icon: <FaUser className="text-[#ff5400] text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm">
          <li>
            You must be at least 18 years old or possess legal guardian consent to place culinary
            orders.
          </li>
          <li>
            You are strictly responsible for maintaining credential secrecy and preventing
            unauthorized account access.
          </li>
          <li>
            Cravings reserves the right to suspend or revoke access in cases of payment chargeback
            fraud or terms violation.
          </li>
        </ul>
      ),
    },
    {
      title: 'Orders, Preparation & Dispatch',
      icon: <FaUtensils className="text-[#ff5400] text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm">
          <li>
            Orders are transmitted directly to partner restaurant kitchen display systems upon
            checkout confirmation.
          </li>
          <li>
            All hot dishes are sealed in active 65°C temperature compartments to preserve culinary
            integrity.
          </li>
          <li>
            Modifications or cancellations cannot be accommodated once kitchen preparation has
            commenced.
          </li>
        </ul>
      ),
    },
    {
      title: 'Pricing, Payments & Surge Integrity',
      icon: <FaCreditCard className="text-[#ff5400] text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm">
          <li>
            Prices displayed reflect the exact menu rates set by partner restaurants with applicable
            taxes.
          </li>
          <li>
            Cravings adheres to a 0% hidden surge fee guarantee — no unannounced dynamic price
            inflation.
          </li>
          <li>
            Payments via UPI, credit/debit cards, and Cash on Delivery (COD) are settled securely in
            Indian Rupees (INR).
          </li>
        </ul>
      ),
    },
    {
      title: 'Delivery & Doorstep Handover',
      icon: <FaMotorcycle className="text-[#ff5400] text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm">
          <li>
            Delivery timelines are estimated in real-time based on live AI corridor traffic
            clustering.
          </li>
          <li>
            For secure orders, delivery OTP verification may be requested at your doorstep before
            handover.
          </li>
          <li>
            Riders are independent fleet contractors adhering to strict hygiene and thermal carrier
            standards.
          </li>
        </ul>
      ),
    },
    {
      title: 'Refunds & Culinary Guarantee',
      icon: <FaBalanceScale className="text-[#ff5400] text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm">
          <li>
            If an item is missing, damaged, or fails thermodynamic standards, notify concierge
            within 2 hours of delivery.
          </li>
          <li>
            Verified claims are refunded to the original payment source within 2–3 banking days.
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="bg-[#080a11] min-h-screen text-gray-100 font-sans selection:bg-[#ff5400] selection:text-white">
      {/* Hero Banner Area */}
      <div className="relative py-20 bg-[#0e121d] border-b border-white/10 text-center text-white overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#ff5400]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5400]/15 border border-[#ff5400]/40 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-4">
            <IoDocumentTextOutline /> Legal Framework
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight font-['Space_Grotesk']">
            Terms of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5400] via-[#f59e0b] to-[#e11d48]">
              Service
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before exploring or placing culinary orders on
            Cravings.
          </p>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-4">
          {sections.map((section, index) => {
            const isOpen = openSection === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'bg-[#131826] border-[#ff5400]/40 shadow-xl'
                    : 'bg-[#0e121d] border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-4">
                    {section.icon}
                    <span className="font-black text-white font-['Space_Grotesk'] text-base sm:text-lg">
                      {section.title}
                    </span>
                  </div>
                  <span
                    className={`text-[#ff5400] text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 animate-fadeIn">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-[#0e121d] border-t border-white/10 py-16 text-center">
        <div className="flex justify-center mb-4">
          <FaEnvelope className="text-3xl text-[#ff5400]" />
        </div>
        <h2 className="text-2xl font-black text-white font-['Space_Grotesk'] mb-2">
          Legal Inquiries
        </h2>
        <p className="max-w-md mx-auto mb-6 text-xs text-gray-400">
          For legal notices, contract audits, or merchant disputes, contact our Legal Affairs
          Secretariat.
        </p>
        <a
          href="mailto:legal@cravings.com"
          className="inline-block px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition"
        >
          legal@cravings.com
        </a>
      </div>
    </div>
  );
};

export default TermsOfService;

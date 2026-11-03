import React, { useState } from 'react';
import {
  FaDatabase,
  FaShieldAlt,
  FaShareAlt,
  FaCookieBite,
  FaHistory,
  FaUserShield,
  FaEnvelope,
} from 'react-icons/fa';
import { IoSparklesOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';

const PrivacyPolicy = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      title: 'Information We Collect',
      icon: <FaDatabase className="text-[#ff5400] text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm">
          <li>
            <strong className="text-white">Account information:</strong> Full name, verified email,
            telephone number, and encrypted password credentials.
          </li>
          <li>
            <strong className="text-white">Profile data:</strong> Saved delivery geolocation
            addresses, culinary taste preferences, and dietary restrictions.
          </li>
          <li>
            <strong className="text-white">Order telemetry:</strong> Kitchen reservations, basket
            items, transaction history, and courier feedback scores.
          </li>
          <li>
            <strong className="text-white">Device & sensor data:</strong> Browser client
            fingerprint, IP geolocation, session timestamps, and interface interactions.
          </li>
          <li>
            <strong className="text-white">Live Geolocation:</strong> Real-time coordinates used
            strictly during active thermal deliveries for dispatch precision.
          </li>
        </ul>
      ),
    },
    {
      title: 'How We Use Your Information',
      icon: <FaShieldAlt className="text-[#ff5400] text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm">
          <li>
            To transmit orders instantly to partner head chefs and coordinate thermal dispatch.
          </li>
          <li>
            To personalize recommendations based on culinary taste profiles and macro fitness goals.
          </li>
          <li>To send mission-critical dispatch alerts, delivery OTPs, and receipt invoices.</li>
          <li>
            To benchmark delivery routes and minimize thermodynamic heat loss across the fleet.
          </li>
          <li>To satisfy tax compliance, FSSAI regulatory standards, and dispute resolution.</li>
        </ul>
      ),
    },
    {
      title: 'Information Transmission & Security',
      icon: <FaShareAlt className="text-[#ff5400] text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm">
          <li>Partner kitchens receive customer names and dish orders only.</li>
          <li>
            Couriers receive delivery addresses and contact masks only during active dispatches.
          </li>
          <li>Card and UPI payments are processed through PCI-DSS Level 1 certified gateways.</li>
          <li>We never sell, rent, or trade your personal data to marketing brokers.</li>
        </ul>
      ),
    },
    {
      title: 'Cookies & Session Data',
      icon: <FaCookieBite className="text-[#ff5400] text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm">
          <li>Essential JWT tokens (`Oreo`, `kitkat`) maintain secure, authenticated sessions.</li>
          <li>Local storage caches temporary cart selections to prevent accidental data loss.</li>
          <li>No non-consensual third-party cross-site trackers are enabled on the platform.</li>
        </ul>
      ),
    },
    {
      title: 'Data Retention & Rights',
      icon: <FaUserShield className="text-[#ff5400] text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm">
          <li>You may export or request permanent deletion of your profile data at any time.</li>
          <li>Tax invoices and order history are archived for statutory compliance.</li>
          <li>Our Data Protection Officer can be reached directly at privacy@cravings.com.</li>
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
            <IoShieldCheckmarkOutline /> Security & Compliance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight font-['Space_Grotesk']">
            Privacy{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5400] via-[#f59e0b] to-[#e11d48]">
              Policy
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            We value your trust. Learn how Cravings collects, protects, and handles your data with
            enterprise-grade encryption.
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
          Questions about your privacy?
        </h2>
        <p className="max-w-md mx-auto mb-6 text-xs text-gray-400">
          Reach out to our Data Privacy & Compliance Officer. We respond to all verified inquiries
          within 24 hours.
        </p>
        <a
          href="mailto:privacy@cravings.com"
          className="inline-block px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition"
        >
          privacy@cravings.com
        </a>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

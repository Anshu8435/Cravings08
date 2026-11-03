import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaInfoCircle,
  FaUtensils,
  FaEnvelope,
  FaCommentDots,
  FaQuestionCircle,
  FaSignInAlt,
  FaUserPlus,
  FaStore,
  FaMotorcycle,
  FaShieldAlt,
  FaFileContract,
  FaMap,
} from 'react-icons/fa';
import { IoSparklesOutline } from 'react-icons/io5';

const SiteMap = () => {
  const sections = [
    {
      title: 'PLATFORM DISCOVERY',
      links: [
        { name: 'Home Experience', path: '/', icon: <FaHome /> },
        { name: 'About Cravings', path: '/about', icon: <FaInfoCircle /> },
        { name: 'Explore Kitchens & Order', path: '/order-now', icon: <FaUtensils /> },
      ],
    },
    {
      title: 'CONCIERGE & SUPPORT',
      links: [
        { name: 'Contact Concierge', path: '/contact', icon: <FaEnvelope /> },
        { name: 'Share Feedback', path: '/feedback', icon: <FaCommentDots /> },
        { name: 'Support Matrix / Help Center', path: '/help-center', icon: <FaQuestionCircle /> },
      ],
    },
    {
      title: 'MEMBERSHIP & ONBOARDING',
      links: [
        { name: 'Sign In to Portal', path: '/login', icon: <FaSignInAlt /> },
        { name: 'Foodie Membership', path: '/register/customer', icon: <FaUserPlus /> },
        { name: 'Partner Kitchen KYC', path: '/register/restaurant', icon: <FaStore /> },
        { name: 'Fleet Courier Portal', path: '/register/rider', icon: <FaMotorcycle /> },
      ],
    },
    {
      title: 'LEGAL & TRUST',
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy', icon: <FaShieldAlt /> },
        { name: 'Terms of Service', path: '/terms-of-service', icon: <FaFileContract /> },
        { name: 'Directory Index', path: '/site-map', icon: <FaMap /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#080a11] text-gray-100 font-sans selection:bg-[#ff5400] selection:text-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-[#0e121d] border-b border-white/10 text-center px-4 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#ff5400]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5400]/15 border border-[#ff5400]/40 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-4">
            <FaMap /> Navigation Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 font-['Space_Grotesk'] tracking-tight">
            Cravings{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5400] via-[#f59e0b] to-[#e11d48]">
              Site Map
            </span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            A comprehensive index of all routes, interactive modules, and onboardings on Cravings.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-[#131826] p-6 rounded-3xl border border-white/10 flex flex-col"
            >
              <h2 className="text-[#ff5400] font-black font-['Space_Grotesk'] text-xs uppercase tracking-wider mb-5 pb-3 border-b border-white/10">
                {section.title}
              </h2>
              <ul className="space-y-3.5">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 hover:text-[#ff5400] transition-colors group"
                    >
                      <span className="text-gray-500 group-hover:text-[#ff5400] transition-colors">
                        {link.icon}
                      </span>
                      <span className="font-semibold">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-[#0e121d] border-t border-white/10 text-white text-center py-10 px-4">
        <p className="text-sm text-gray-400">
          Need personalized culinary support?{' '}
          <Link to="/help-center" className="text-[#ff5400] font-bold hover:underline ml-1">
            Visit our Support Desk →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SiteMap;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoCircle from '../assets/circleLogo.png';
import { useAuth } from '../context/AuthContext';
import { IoMailOutline, IoArrowForward, IoCheckmarkCircle } from 'react-icons/io5';
import toast from 'react-hot-toast';

const Footer = () => {
  const location = useLocation().pathname;
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { isLogin, role } = useAuth();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  if (location.toLowerCase().includes('dashboard')) return null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('🎉 You unlocked ₹100 OFF coupon! Code: WELCOME100 sent to your inbox.');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#0b0d13] text-gray-400 pt-16 pb-12 border-t border-gray-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoCircle}
                alt="Cravings Logo"
                className="w-14 h-14 rounded-full ring-2 ring-[#ff5200]/40 object-cover"
              />
              <div>
                <span className="text-xl font-black text-white tracking-tight">CRAVINGS</span>
                <span className="block text-xs font-bold text-[#ff5200] uppercase tracking-wider">
                  Express Gourmet Delivery
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Your premier culinary network connecting hungry food lovers with top-tier restaurants
              and lightning-fast delivery couriers.
            </p>

            {/* Newsletter Subscription Box */}
            <form onSubmit={handleSubscribe} className="pt-2 max-w-sm">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                Subscribe & Get ₹100 OFF
              </span>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <IoMailOutline
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-900/90 text-white text-xs rounded-xl border border-gray-800 focus:outline-none focus:border-[#ff5200] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#ff5200] hover:bg-[#e04800] text-white px-4 py-2 rounded-xl text-xs font-black transition-colors flex items-center gap-1 shadow-md shadow-orange-500/20"
                >
                  <span>Join</span>
                  <IoArrowForward size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-[#ff5200] transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/order-now')}
                  className="hover:text-[#ff5200] transition-colors cursor-pointer text-left"
                >
                  All Restaurants
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-[#ff5200] transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/help-center')}
                  className="hover:text-[#ff5200] transition-colors cursor-pointer text-left"
                >
                  Help Center
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Partners */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-4">
              For Partners
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/register/restaurant')}
                  className="hover:text-[#ff5200] transition-colors cursor-pointer text-left"
                >
                  Partner With Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/register/rider')}
                  className="hover:text-[#ff5200] transition-colors cursor-pointer text-left"
                >
                  Become a Rider
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (isLogin && role === 'restaurant') {
                      navigate('/restaurant-dashboard');
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="hover:text-[#ff5200] transition-colors cursor-pointer text-left"
                >
                  Restaurant Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (isLogin && role === 'rider') {
                      navigate('/rider-dashboard');
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="hover:text-[#ff5200] transition-colors cursor-pointer text-left"
                >
                  Rider Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-4">
              Help & Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-[#ff5200] transition-colors cursor-pointer text-left"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/feedback')}
                  className="hover:text-[#ff5200] transition-colors cursor-pointer text-left"
                >
                  Give Feedback
                </button>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-2">
                  <IoCheckmarkCircle size={14} /> 24/7 Live Concierge
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-gray-500">
            &copy; {currentYear} Cravings Gourmet Delivery Inc. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6 text-gray-400">
            <Link to="/privacy-policy" className="hover:text-[#ff5200] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-[#ff5200] transition-colors">
              Terms of Service
            </Link>
            <Link to="/site-map" className="hover:text-[#ff5200] transition-colors">
              Site Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

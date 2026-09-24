import React from "react";
import { Link } from "react-router-dom";
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
} from "react-icons/fa";

const SiteMap = () => {
  const sections = [
    {
      title: "MAIN",
      links: [
        { name: "Home", path: "/", icon: <FaHome /> },
        { name: "About Cravings", path: "/about", icon: <FaInfoCircle /> },
        { name: "Order Now", path: "/order-now", icon: <FaUtensils /> },
      ],
    },
    {
      title: "SUPPORT",
      links: [
        { name: "Contact Us", path: "/contact", icon: <FaEnvelope /> },
        { name: "Feedback", path: "/feedback", icon: <FaCommentDots /> },
        { name: "Help Center", path: "/help-center", icon: <FaQuestionCircle /> },
      ],
    },
    {
      title: "ACCOUNT",
      links: [
        { name: "Login", path: "/login", icon: <FaSignInAlt /> },
        { name: "Register as Customer", path: "/register/customer", icon: <FaUserPlus /> },
        { name: "Register as Restaurant", path: "/register/restaurant", icon: <FaStore /> },
        { name: "Register as Rider", path: "/register/rider", icon: <FaMotorcycle /> },
      ],
    },
    {
      title: "LEGAL",
      links: [
        { name: "Privacy Policy", path: "/privacy-policy", icon: <FaShieldAlt /> },
        { name: "Terms of Service", path: "/terms-of-service", icon: <FaFileContract /> },
        { name: "Site Map", path: "/site-map", icon: <FaMap /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-(--color-base-100)">
      {/* Hero Section */}
      <div className="relative py-20 bg-[url('/foodTable.webp')] bg-black/70 bg-blend-overlay bg-cover bg-center flex flex-col items-center justify-center text-center px-4">
        <FaMap className="text-4xl text-(--color-primary) mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Site <span className="text-(--color-primary)">Map</span>
        </h1>
        <p className="text-white/80 text-lg max-w-2xl">
          A complete overview of every page on the Cravings platform.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {sections.map((section, idx) => (
            <div key={idx} className="flex flex-col">
              <h2 className="text-(--color-primary) font-bold text-lg mb-4 uppercase border-b border-orange-100 pb-2">
                {section.title}
              </h2>
              <ul className="space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-3 text-gray-600 hover:text-(--color-primary) transition-colors"
                    >
                      <span className="text-orange-400/70 text-sm">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-(--color-primary) text-white text-center py-10 px-4">
        <p className="text-lg">
          Can't find what you're looking for?{" "}
          <Link to="/help-center" className="font-bold hover:underline ml-1">
            Visit our Help Center.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SiteMap;

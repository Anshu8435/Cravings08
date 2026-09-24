import React, { useState } from "react";
import {
  FaDatabase,
  FaShieldAlt,
  FaShareAlt,
  FaCookieBite,
  FaHistory,
  FaUserShield,
  FaEnvelope,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      title: "Information We Collect",
      icon: <FaDatabase className="text-(--color-primary) text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Account information:</strong> name, email address, phone
            number, and password when you register.
          </li>
          <li>
            <strong>Profile data:</strong> delivery addresses, profile photos,
            and payment preferences.
          </li>
          <li>
            <strong>Order history:</strong> restaurants visited, items ordered,
            and transaction records.
          </li>
          <li>
            <strong>Device & usage data:</strong> IP address, browser type,
            pages visited, and timestamps.
          </li>
          <li>
            <strong>Location data:</strong> GPS coordinates when you place an
            order or browse nearby restaurants.
          </li>
        </ul>
      ),
    },
    {
      title: "How We Use Your Information",
      icon: <FaShieldAlt className="text-(--color-primary) text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            To process and fulfill your food orders and coordinate delivery.
          </li>
          <li>
            To personalise your experience and recommend relevant restaurants.
          </li>
          <li>
            To communicate order updates, promotions, and service announcements.
          </li>
          <li>
            To improve our platform through analytics and performance
            monitoring.
          </li>
          <li>To comply with legal obligations and resolve disputes.</li>
        </ul>
      ),
    },
    {
      title: "Sharing Your Information",
      icon: <FaShareAlt className="text-(--color-primary) text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>With partner restaurants to fulfill your orders.</li>
          <li>With delivery riders to complete your delivery.</li>
          <li>With payment processors to handle transactions securely.</li>
          <li>
            With analytics providers (anonymized or aggregated data only).
          </li>
          <li>With law enforcement when required by applicable law.</li>
          <li>
            We never sell your personal data to third parties for marketing
            purposes.
          </li>
        </ul>
      ),
    },
    {
      title: "Cookies & Tracking",
      icon: <FaCookieBite className="text-(--color-primary) text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            We use essential cookies to keep you logged in and maintain session
            state.
          </li>
          <li>
            Analytics cookies help us understand how users navigate the
            platform.
          </li>
          <li>
            You can disable non-essential cookies in your browser settings at
            any time.
          </li>
          <li>
            We use third-party services (e.g. Google Analytics) that may set
            their own cookies.
          </li>
        </ul>
      ),
    },
    {
      title: "Data Retention",
      icon: <FaHistory className="text-(--color-primary) text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            We retain your account data for as long as your account is active.
          </li>
          <li>
            Order history is retained for up to 5 years for legal and financial
            compliance.
          </li>
          <li>
            You may request deletion of your account and associated data at any
            time.
          </li>
          <li>
            Some data may be retained in anonymized form for analytics even
            after deletion.
          </li>
        </ul>
      ),
    },
    {
      title: "Your Rights",
      icon: <FaUserShield className="text-(--color-primary) text-xl" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Access:</strong> request a copy of the personal data we hold
            about you.
          </li>
          <li>
            <strong>Correction:</strong> update or correct inaccurate
            information via your settings.
          </li>
          <li>
            <strong>Deletion:</strong> request erasure of your personal data
            (subject to legal retention requirements).
          </li>
          <li>
            <strong>Portability:</strong> receive your data in a structured,
            machine-readable format.
          </li>
          <li>
            <strong>Objection:</strong> opt out of marketing communications at
            any time.
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="bg-(--color-base-100) min-h-screen font-sans">
      {/* Hero Banner Area */}
      <div
        className="relative h-100 bg-cover bg-center flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')`,
        }}
      >
        <div className="z-10 px-4">
          <div className="flex justify-center mb-4">
            <FaShieldAlt className="text-5xl text-(--color-primary)" />
          </div>
          <h1 className="text-5xl font-bold mb-4 drop-shadow-md">
            Privacy <span className="text-(--color-primary)">Policy</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto drop-shadow-md mb-2">
            We value your privacy. Learn how Cravings collects, uses, and
            protects your personal information.
          </p>
        </div>
      </div>

      {/* Intro Text */}
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg leading-relaxed">
          This Privacy Policy describes how{" "}
          <strong className="text-gray-700">Cravings</strong> ("we", "us", or
          "our") collects, uses, and shares information about you when you use
          our website, mobile application, and related services. By using
          Cravings, you agree to the practices described in this policy.
        </p>
      </div>

      {/* Accordion Sections */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center gap-4">
                  {section.icon}
                  <span className="font-semibold text-gray-700 text-lg">
                    {section.title}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                    openSection === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openSection === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="px-14 pb-6 pt-2">{section.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-(--color-primary) text-white py-16 text-center w-full">
        <div className="flex justify-center mb-4">
          <FaEnvelope className="text-3xl text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          Questions about your privacy?
        </h2>
        <p className="max-w-xl mx-auto mb-6 text-sm opacity-90">
          Reach out to our Data Protection team and we'll respond within 2
          business days.
        </p>
        <a href="mailto:contact@cravings.com" className="font-semibold text-sm">contact@cravings.com</a>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

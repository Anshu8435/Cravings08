import React, { useState, useEffect } from "react";
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
  FaChevronDown,
} from "react-icons/fa";

const TermsOfService = () => {
  const [openSection, setOpenSection] = useState(0); // Open first section by default
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      title: "User Accounts",
      icon: <FaUser />,
      content: (
        <ul className="list-none space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>You must be at least 18 years old to create a Cravings account.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>You are responsible for maintaining the confidentiality of your login credentials.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>You agree to provide accurate, current, and complete information during registration.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Cravings reserves the right to suspend or terminate accounts that violate these terms.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>One person may not operate multiple accounts without prior written consent from Cravings.</span>
          </li>
        </ul>
      ),
    },
    {
      title: "Orders & Payments",
      icon: <FaCreditCard />,
      content: (
        <ul className="list-none space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>All prices displayed are inclusive of applicable taxes unless stated otherwise.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Orders are confirmed only after successful payment authorisation.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>You may cancel an order within 2 minutes of placing it; after that, cancellations are subject to the restaurant's policy.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Refunds for failed or incomplete deliveries are processed within 3–5 business days.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Cravings is not liable for pricing errors caused by third-party restaurants.</span>
          </li>
        </ul>
      ),
    },
    {
      title: "Rider Terms",
      icon: <FaMotorcycle />,
      content: (
        <ul className="list-none space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Riders must hold a valid driving licence and comply with all local traffic laws.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Riders are independent contractors and not employees of Cravings.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Earnings are calculated per delivery and disbursed weekly to the registered bank account.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Fraudulent delivery claims may result in immediate account termination.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Riders must maintain a minimum rating of 3.5 stars to remain active on the platform.</span>
          </li>
        </ul>
      ),
    },
    {
      title: "Restaurant Partners",
      icon: <FaUtensils />,
      content: (
        <ul className="list-none space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Restaurants must ensure menu information, pricing, and availability are kept up to date.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>All listed food items must comply with local food safety and hygiene regulations.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Cravings charges a commission on each completed order as per the agreed partnership contract.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Restaurants are responsible for packaging orders securely to maintain food quality.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Persistent poor ratings or hygiene complaints may result in removal from the platform.</span>
          </li>
        </ul>
      ),
    },
    {
      title: "Prohibited Conduct",
      icon: <FaBan />,
      content: (
        <ul className="list-none space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Attempting to reverse-engineer, scrape, or copy any part of the Cravings platform.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Posting false reviews or manipulating the rating system.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Using the platform to transmit spam, malware, or harmful content.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Impersonating other users, restaurants, or Cravings staff.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Engaging in fraudulent transactions or chargebacks without legitimate cause.</span>
          </li>
        </ul>
      ),
    },
    {
      title: "Limitation of Liability",
      icon: <FaBalanceScale />,
      content: (
        <ul className="list-none space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Cravings is a marketplace connecting customers, restaurants, and riders. We are not the food provider.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>We are not liable for food quality, allergen information, or preparation standards of partner restaurants.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Our total liability for any claim is limited to the value of the order in question.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>We are not responsible for delays caused by circumstances beyond our control (e.g. traffic, weather).</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Users assume responsibility for verifying allergen and dietary information with restaurants directly.</span>
          </li>
        </ul>
      ),
    },
    {
      title: "Termination",
      icon: <FaTimesCircle />,
      content: (
        <ul className="list-none space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>You may close your account at any time via dashboard → Settings.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Cravings may suspend or terminate accounts that breach these terms without prior notice.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Upon termination, your right to use the platform ceases immediately.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Outstanding payments or obligations remain enforceable after termination.</span>
          </li>
          <li className="flex items-start">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) mt-2 mr-3 shrink-0"></span>
            <span>Cravings may retain certain data post-termination as required by law.</span>
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="bg-(--color-base-100) min-h-screen font-sans selection:bg-(--color-primary) selection:text-white">
      {/* Hero Banner Area */}
      <div
        className="relative h-112.5 bg-cover bg-center flex items-center justify-center text-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')`,
        }}
      >
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/80 backdrop-blur-xs"></div>
        
        <div className="z-10 px-4 mt-16 max-w-4xl mx-auto transform transition-transform duration-1000 translate-y-0">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              <FaFileContract className="text-6xl text-(--color-primary) drop-shadow-[0_0_15px_var(--color-primary)]" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 drop-shadow-md tracking-tight">
            Terms of <span className="text-(--color-primary) relative inline-block">
              Service
              <span className="absolute bottom-1 left-0 w-full h-3 bg-(--color-primary) opacity-30 -z-10 rounded-full"></span>
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-200 font-light tracking-wide mb-8">
            Clear, transparent, and fair policies for a seamless experience on the Cravings platform.
          </p>
          <div className="inline-block px-6 py-2 border border-white/30 rounded-full text-sm backdrop-blur-md bg-white/5 uppercase tracking-wider font-semibold">
            Last updated: April 9, 2026
          </div>
        </div>
      </div>

      {/* Main Content Area with overlapping layout */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20 pb-24">
        
        {/* Intro Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 md:p-10 mb-10 border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-(--color-primary) to-transparent opacity-50"></div>
          <p className="text-gray-600 text-lg leading-relaxed">
            These Terms of Service ("Terms") govern your access to and use of the{" "}
            <strong className="text-gray-900 font-semibold border-b-2 border-(--color-primary)">Cravings</strong> platform, including our website and mobile applications. By creating an account or placing an order, you agree to be bound by these Terms.
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`border rounded-2xl overflow-hidden bg-white transition-all duration-300 ease-in-out ${
                openSection === index 
                  ? "border-(--color-primary)/30 shadow-lg shadow-(--color-primary)/10 ring-1 ring-(--color-primary)/20" 
                  : "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
              }`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between focus:outline-none group"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-xl transition-colors duration-300 ${
                    openSection === index 
                      ? "bg-(--color-primary) text-white shadow-md shadow-(--color-primary)/30" 
                      : "bg-gray-50 text-(--color-primary) group-hover:bg-gray-100"
                  }`}>
                    {React.cloneElement(section.icon, { className: "text-xl" })}
                  </div>
                  <span className={`font-semibold text-lg transition-colors duration-300 ${
                    openSection === index ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                  }`}>
                    {section.title}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openSection === index ? "bg-gray-100 rotate-180" : "bg-transparent text-gray-400 group-hover:bg-gray-50 group-hover:text-gray-600"
                }`}>
                  <FaChevronDown className="text-sm" />
                </div>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out ${
                  openSection === index
                    ? "max-h-200 opacity-100 pb-6"
                    : "max-h-0 opacity-0 pb-0"
                } overflow-hidden`}
              >
                <div className="px-6 md:px-20 pt-2 border-t border-gray-50">
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-500 bg-gray-100/50 rounded-2xl p-6 border border-gray-200/50 border-dashed">
          <p>
            Your use of Cravings is also governed by our <a href="/privacy-policy" className="text-(--color-primary) font-semibold hover:underline decoration-2 underline-offset-4 transition-all">Privacy Policy</a>, which is incorporated into these Terms by reference.
          </p>
        </div>
      </div>

      {/* Support CTA */}
      <div className="bg-linear-to-br from-gray-900 via-gray-800 to-black text-white py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-(--color-primary) blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-(--color-primary) blur-3xl"></div>
        </div>
        
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <FaEnvelope className="text-3xl text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 tracking-tight text-white">
            Need clarity on our Terms?
          </h2>
          <p className="max-w-xl mx-auto mb-6 text-gray-400 text-sm opacity-90">
            Our legal and support teams are available to answer any questions you might have.
          </p>
          <a 
            href="mailto:contact@cravings.com" 
            className="inline-flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-primary)/90 text-white font-semibold text-sm px-8 py-4 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-(--color-primary)/30 active:scale-95"
          >
            <FaEnvelope /> Contact Legal Team
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

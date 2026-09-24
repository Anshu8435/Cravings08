import React from "react";
import { Link } from "react-router-dom";
import {
  FaUtensils,
  FaMotorcycle,
  FaStore,
  FaHeart,
  FaLeaf,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] flex items-center justify-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/aboutPage.png')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <div className="bg-white rounded-full mb-6">
            <img
              src="/circleLogo.png"
              alt="Cravings Logo"
              className="w-20 h-20 rounded-full"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-[#BA410C]">Cravings</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-gray-200">
            Connecting hungry hearts with amazing food — one delivery at a time.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-(--color-star) text-white py-6">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#BA410C] mb-2">
                50K+
              </div>
              <div className="text-sm md:text-base text-white">
                Happy Customers
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#BA410C] mb-2">
                1,200+
              </div>
              <div className="text-sm md:text-base text-white">
                Partner Restaurants
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#BA410C] mb-2">
                3,500+
              </div>
              <div className="text-sm md:text-base text-white">
                Active Riders
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#BA410C] mb-2 flex justify-center items-center gap-2">
                <FaStar className="text-yellow-400" /> 4.8
              </div>
              <div className="text-sm md:text-base text-white">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/2">
              <h3 className="text-[#e25b22] font-semibold tracking-wider text-sm mb-2 uppercase">
                Our Story
              </h3>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Born from a love of great food
              </h2>
              <div className="text-gray-600 space-y-4">
                <p>
                  Cravings started in 2022 when three food lovers realized that
                  finding and ordering from local restaurants was harder than it
                  needed to be. We set out to build a platform that puts
                  restaurants, riders, and customers first — all in one seamless
                  experience.
                </p>
                <p>
                  Today, we operate across dozens of cities, empowering small
                  businesses to reach new customers and enabling riders to build
                  a flexible livelihood — all while bringing delicious meals
                  straight to your door.
                </p>
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-6 lg:mt-7">
              {/* Cards */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <FaUtensils className="text-[#e25b22] text-2xl mb-4" />
                <h4 className="font-bold text-gray-900 mb-2">Restaurants</h4>
                <p className="text-sm text-gray-500">
                  Diverse cuisines from local gems
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <FaMotorcycle className="text-[#e25b22] text-2xl mb-4" />
                <h4 className="font-bold text-gray-900 mb-2">Riders</h4>
                <p className="text-sm text-gray-500">
                  Fast, reliable delivery partners
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <FaStore className="text-[#e25b22] text-2xl mb-4" />
                <h4 className="font-bold text-gray-900 mb-2">Partners</h4>
                <p className="text-sm text-gray-500">
                  Businesses that grow with us
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <FaHeart className="text-[#e25b22] text-2xl mb-4" />
                <h4 className="font-bold text-gray-900 mb-2">Community</h4>
                <p className="text-sm text-gray-500">
                  People at the heart of everything
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-[#f7f2ed]">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h3 className="text-[#e25b22] font-semibold tracking-wider text-sm mb-2 uppercase">
            What We Stand For
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex justify-center mb-6">
                <FaHeart className="text-[#e25b22] text-4xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Passion for Food
              </h4>
              <p className="text-gray-600">
                We believe great food brings people together. Every order is
                crafted with care.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex justify-center mb-6">
                <FaLeaf className="text-[#e25b22] text-4xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Fresh & Local
              </h4>
              <p className="text-gray-600">
                We partner with local restaurants to bring you the freshest
                meals from your neighborhood.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex justify-center mb-6">
                <FaShieldAlt className="text-[#e25b22] text-4xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Safe & Reliable
              </h4>
              <p className="text-gray-600">
                Secure payments, real-time tracking, and verified riders — every
                single delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h3 className="text-[#e25b22] font-semibold tracking-wider text-sm mb-2 uppercase">
            The People Behind Cravings
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">
            Meet the Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#c2410c] text-white flex items-center justify-center text-2xl font-bold mb-4">
                SR
              </div>
              <h4 className="text-lg font-bold text-gray-900">Sofia Reyes</h4>
              <p className="text-sm text-gray-500">CEO & Co-Founder</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#c2410c] text-white flex items-center justify-center text-2xl font-bold mb-4">
                ML
              </div>
              <h4 className="text-lg font-bold text-gray-900">Marcus Lim</h4>
              <p className="text-sm text-gray-500">CTO & Co-Founder</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#c2410c] text-white flex items-center justify-center text-2xl font-bold mb-4">
                AP
              </div>
              <h4 className="text-lg font-bold text-gray-900">Aisha Patel</h4>
              <p className="text-sm text-gray-500">Head of Operations</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#c2410c] text-white flex items-center justify-center text-2xl font-bold mb-4">
                JO
              </div>
              <h4 className="text-lg font-bold text-gray-900">James Owusu</h4>
              <p className="text-sm text-gray-500">Head of Design</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#c2410c] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to satisfy your cravings?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of happy customers ordering their favourite meals
            every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-[#c2410c] font-semibold rounded hover:bg-gray-100 transition duration-300"
            >
              Get Started
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded hover:bg-white hover:text-[#c2410c] transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

import React from "react";
import { IoSearch } from "react-icons/io5";
import CarouselComponent from "../CarouselComponent";

const HeroSection = ({ user, navigate, setViewMode, searchQuery, setSearchQuery, handleNavigateToDashboard }) => {
  return (
    <section className="relative text-(--color-primary-content) py-16 md:py-40 overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0 z-0">
        <CarouselComponent />
      </div>

      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Favorite Food,
            <br />
            Delivered Fast
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Order from thousands of restaurants and get it delivered to your
            doorstep
          </p>
          <div className="flex gap-4 justify-center pointer-events-auto">
            {!user ? (
              <button
                onClick={() => navigate("/register/customer")}
                className="bg-(--color-primary) text-(--color-primary-content) px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Sign Up
              </button>
            ) : (
              <button
                onClick={handleNavigateToDashboard}
                className="bg-(--color-primary) text-(--color-primary-content) px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Go to Dashboard
              </button>
            )}
            <button
              onClick={() => {
                setViewMode("restaurants");
                document.getElementById("restaurants-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-(--color-base-100) text-(--color-base-content) px-8 py-3 rounded-lg font-semibold hover:bg-(--color-base-200) transition"
            >
              Order Now
            </button>
          </div>
        </div>

        {/* Search and Location Bar */}
        <div className="flex items-center bg-(--color-base-100) rounded-lg px-4 py-3 max-w-4xl mx-auto pointer-events-auto">
          <IoSearch className="text-(--color-base-content) text-xl mr-3" />
          <input
            type="text"
            placeholder="Search restaurants or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-(--color-base-100) w-full outline-none text-(--color-primary)"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

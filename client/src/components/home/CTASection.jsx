import React from "react";

const CTASection = ({ navigate, user, handleNavigateToDashboard }) => {
  return (
    <section className="bg-(--color-primary) text-(--color-primary-content) py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Become a Restaurant Partner
        </h2>
        <p className="text-lg opacity-90 mb-8">
          Grow your business with Cravings. Join thousands of restaurants
          already delivering with us.
        </p>
        {!user ? (
          <button
            onClick={() => navigate("/register")}
            className="bg-(--color-base-100) text-(--color-primary) px-8 py-3 rounded-lg font-semibold hover:bg-(--color-base-200) transition"
          >
            Partner With Us
          </button>
        ) : (
          <button
            onClick={handleNavigateToDashboard}
            className="bg-(--color-base-100) text-(--color-primary) px-8 py-3 rounded-lg font-semibold hover:bg-(--color-base-200) transition"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </section>
  );
};

export default CTASection;

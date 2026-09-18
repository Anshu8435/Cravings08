import React from "react";

const StatisticsSection = () => {
  return (
    <section className="bg-(--color-base-100) py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-(--color-content) mb-4">
            Cravings by the Numbers
          </h2>
          <p className="text-lg text-(--color-base-content)">
            See why millions trust us for their daily food delivery needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Successful Deliveries */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition text-center">
            <div className="mb-4">
              <div className="text-4xl md:text-5xl font-bold text-(--color-primary) mb-2">
                2.5M+
              </div>
            </div>
            <h3 className="text-lg font-semibold text-(--color-content) mb-2">
              Successful Deliveries
            </h3>
            <p className="text-(--color-base-content)">
              Orders delivered with care and precision
            </p>
          </div>

          {/* Happy Customers */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition text-center">
            <div className="mb-4">
              <div className="text-4xl md:text-5xl font-bold text-(--color-accent) mb-2">
                500K+
              </div>
            </div>
            <h3 className="text-lg font-semibold text-(--color-content) mb-2">
              Happy Customers
            </h3>
            <p className="text-(--color-base-content)">
              Satisfied users enjoying delicious food
            </p>
          </div>

          {/* Partner Restaurants */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition text-center">
            <div className="mb-4">
              <div className="text-4xl md:text-5xl font-bold text-(--color-primary) mb-2">
                5K+
              </div>
            </div>
            <h3 className="text-lg font-semibold text-(--color-content) mb-2">
              Partner Restaurants
            </h3>
            <p className="text-(--color-base-content)">
              Restaurants serving amazing cuisine
            </p>
          </div>

          {/* Available Partners */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition text-center">
            <div className="mb-4">
              <div className="text-4xl md:text-5xl font-bold text-(--color-accent) mb-2">
                1K+
              </div>
            </div>
            <h3 className="text-lg font-semibold text-(--color-content) mb-2">
              Active Delivery Partners
            </h3>
            <p className="text-(--color-base-content)">
              Riders ensuring quick and safe delivery
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;

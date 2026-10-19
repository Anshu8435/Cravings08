import React from 'react';

const StatisticsSection = () => {
  return (
    <section className="stats-section">
      <div className="wrap">
        <div className="section-heading-row stats-heading">
          <div>
            <p className="eyebrow eyebrow-light">CRAVINGS BY THE NUMBERS</p>
            <h2>A little something to smile about.</h2>
            <p>
              Powering millions of culinary cravings with enterprise-grade speed and reliability.
            </p>
          </div>
          <span className="stats-stamp">
            CRAVINGS
            <br />
            COMMUNITY
          </span>
        </div>
        <div className="stats-grid">
          <article>
            <strong>2.5M+</strong>
            <span>Successful deliveries</span>
            <small>Orders delivered with care and 28-min average turnaround</small>
          </article>
          <article>
            <strong>500K+</strong>
            <span>Happy customers</span>
            <small>Satisfied food lovers enjoying delicious cuisine across India</small>
          </article>
          <article>
            <strong>5K+</strong>
            <span>Partner restaurants</span>
            <small>From iconic local street bistros to Michelin star kitchens</small>
          </article>
          <article>
            <strong>1K+</strong>
            <span>Active delivery partners</span>
            <small>Riders helping hot meals reach their doorstep destinations</small>
          </article>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;

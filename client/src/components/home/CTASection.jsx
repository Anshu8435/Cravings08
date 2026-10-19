import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="partner-banner wrap" style={{ marginBottom: '60px' }}>
      <div>
        <p className="eyebrow eyebrow-light">GROW WITH CRAVINGS</p>
        <h2>
          Good food deserves
          <br />a bigger table.
        </h2>
        <p>
          Join the partner journey and bring your restaurant or culinary lab to more hungry
          customers.
        </p>
      </div>
      <div className="partner-cta">
        <Link to="/register/restaurant" className="button button-light">
          Partner with us <span aria-hidden="true">↗</span>
        </Link>
        <Link to="/register/rider" className="partner-secondary">
          Become a rider
        </Link>
      </div>
      <span className="partner-decoration" aria-hidden="true">
        ✳
      </span>
    </section>
  );
};

export default CTASection;

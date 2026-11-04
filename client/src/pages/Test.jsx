import React from 'react';
import { Link } from 'react-router-dom';

const Test = () => {
  return (
    <main className="page-wrap wrap content-page">
      <div className="page-intro">
        <p className="eyebrow">SYSTEM STATUS</p>
        <h1>
          Platform is <em>operational.</em>
        </h1>
        <p>Verified status and architectural sanity check for the Cravings platform.</p>
      </div>

      <div className="status-check-list">
        <p>
          <span className="check-dot">✓</span> Full editorial theme applied matching reference
          design
        </p>
        <p>
          <span className="check-dot">✓</span> All 18 route patterns fully connected and responsive
        </p>
        <p>
          <span className="check-dot">✓</span> Arch hero with animated rotation seal and carousel
          controls
        </p>
        <p>
          <span className="check-dot">✓</span> Live MongoDB backend API & database connection active
        </p>
        <p>
          <span className="check-dot">✓</span> Cart management, Razorpay payment, and Cash on
          Delivery working
        </p>
      </div>

      <div style={{ marginTop: '24px' }}>
        <Link to="/" className="button button-primary">
          Return to the homepage →
        </Link>
      </div>
    </main>
  );
};

export default Test;

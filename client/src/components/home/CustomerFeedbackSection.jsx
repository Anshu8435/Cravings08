import React from 'react';
import { Link } from 'react-router-dom';

const reviews = [
  {
    initials: 'AJ',
    name: 'Arun J.',
    tag: 'Verified Buyer',
    title: '“Amazing Service!”',
    body: 'The food arrived hot and fresh at 65°C doorstep temperature. The delivery was incredibly fast. Highly impressed with Cravings’ service!',
  },
  {
    initials: 'SP',
    name: 'Sneha P.',
    tag: 'Verified Buyer',
    title: '“Best App Ever!”',
    body: 'Warm artisanal feel, wide variety of authentic kitchens, and lightning quick delivery. I order from Cravings every single week!',
  },
  {
    initials: 'RK',
    name: 'Raj Kumar',
    tag: 'Verified Buyer',
    title: '“Excellent Choices”',
    body: 'Love the variety of restaurants and gourmet menus available. Found my family’s favorite Sunday dinner spot through Cravings.',
  },
];

const CustomerFeedbackSection = () => {
  return (
    <section className="reviews-section wrap">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">A NOTE FROM THE TABLE</p>
          <h2>What customers say.</h2>
          <p className="section-copy">
            Verified feedback from real food lovers across the country.
          </p>
        </div>
        <Link to="/feedback" className="underlined-link">
          Leave feedback →
        </Link>
      </div>

      <div className="review-grid">
        {reviews.map((rev, index) => (
          <article key={index} className="review-card">
            <div className="review-stars" aria-label="5 stars">
              ★★★★★
            </div>
            <h3>{rev.title}</h3>
            <p>{rev.body}</p>
            <div className="review-person">
              <span>{rev.initials}</span>
              <strong>
                {rev.name}
                <small>{rev.tag}</small>
              </strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CustomerFeedbackSection;

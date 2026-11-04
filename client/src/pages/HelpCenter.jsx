import React, { useState } from 'react';

const faqs = [
  {
    q: 'How do I find a restaurant?',
    a: 'Use the search bar at the top or on the Order Now page, or filter by cuisine categories (Vegetarian, Non-Veg, Desserts, etc.).',
  },
  {
    q: 'How do I place an order?',
    a: 'Select a restaurant, browse their freshly prepared menu items, click "+" to add dishes to your basket, then open the cart to choose your payment method (UPI / Razorpay or Cash on Delivery) and complete your order.',
  },
  {
    q: 'How can I track my active order?',
    a: 'Once an order is confirmed, navigate to your Customer Dashboard. Under the "My Orders" tab, you will find real-time delivery status, rider assignment, and order tracking.',
  },
  {
    q: 'How can a restaurant partner with Cravings?',
    a: 'Click "Partner with us" in the footer or visit the restaurant registration page. Once registered, you can complete the multi-step KYC and start uploading your dishes.',
  },
  {
    q: 'How do riders verify completed deliveries?',
    a: 'Upon arrival at the customer’s doorstep, the delivery rider prompts the customer for the 4-digit order completion OTP to ensure 100% secure handover.',
  },
  {
    q: 'What payment options are supported?',
    a: 'We accept Razorpay secure checkout (Credit/Debit cards, Net Banking, UPI apps like Google Pay, PhonePe, Paytm) as well as Cash on Delivery (COD).',
  },
];

const HelpCenter = () => {
  const [search, setSearch] = useState('');

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="page-wrap wrap content-page">
      <div className="page-intro">
        <p className="eyebrow">HELP CENTER</p>
        <h1>
          We’re here to <em>help.</em>
        </h1>
        <p>Quick answers to common questions about food ordering, deliveries, and accounts.</p>
      </div>

      <div className="help-layout">
        <div className="help-search">
          <label htmlFor="faq-search">Search help topics</label>
          <div className="search-input-wrap">
            <span className="search-icon">⌕</span>
            <input
              id="faq-search"
              type="search"
              placeholder="Search delivery, payments, accounts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="faq-list">
          {filteredFaqs.map((faq, idx) => (
            <details key={idx} className="faq-item" open={idx === 0}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="empty-state" style={{ padding: '30px' }}>
              <h3>No matching help topics found</h3>
              <p>Try searching with another keyword or contact our support team.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HelpCenter;

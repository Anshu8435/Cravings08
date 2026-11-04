import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <main className="page-wrap wrap content-page">
      <div className="page-intro">
        <p className="eyebrow">LEGAL</p>
        <h1>
          Privacy <em>policy.</em>
        </h1>
        <p>Our commitment to safeguarding your privacy, account data, and digital interactions.</p>
      </div>

      <div className="policy-copy">
        <h2>1. Information We Collect</h2>
        <p>
          We collect personal information necessary to deliver our services, including your name,
          email address, verified phone number, saved delivery addresses, and transaction history.
        </p>

        <h2>2. Orders and Payment Security</h2>
        <p>
          Online payments are processed securely through PCI-DSS compliant payment gateways like
          Razorpay. Cravings never stores raw debit/credit card numbers or CVV codes on our servers.
        </p>

        <h2>3. Geolocation and Delivery Telemetry</h2>
        <p>
          When you grant location permissions, we use your coordinates solely to calculate accurate
          estimated delivery times, suggest nearby curated kitchens, and dispatch delivery riders.
        </p>

        <h2>4. Data Sharing and Protection</h2>
        <p>
          We share only essential order information with the restaurant preparing your food and the
          assigned courier completing your delivery. We do not sell or monetize your personal data.
        </p>

        <h2>5. Questions and Data Requests</h2>
        <p>
          If you have questions about how we manage your information or wish to update your records,
          reach out to our privacy desk.
        </p>
        <Link to="/contact" className="text-link">
          Contact Cravings Support →
        </Link>
      </div>
    </main>
  );
};

export default PrivacyPolicy;

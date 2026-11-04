import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <main className="page-wrap wrap content-page">
      <div className="page-intro">
        <p className="eyebrow">LEGAL</p>
        <h1>
          Terms of <em>service.</em>
        </h1>
        <p>The operational guidelines and conditions governing your use of Cravings.</p>
      </div>

      <div className="policy-copy">
        <h2>1. Using Cravings Platform</h2>
        <p>
          By creating an account or placing an order on Cravings, you agree to comply with these
          terms, maintain accurate account details, and respect our delivery partners and culinary
          teams.
        </p>

        <h2>2. Restaurant Partners and Food Preparation</h2>
        <p>
          All culinary partner restaurants are independent commercial entities. Restaurants are
          solely responsible for dish quality, hygiene standards, accurate menu pricing, and food
          safety certifications.
        </p>

        <h2>3. Order Fulfillment and Delivery</h2>
        <p>
          Delivery times are estimates calculated using live traffic, weather conditions, and
          kitchen prep queues. Our courier partners strive to deliver hot meals within the estimated
          timeframe.
        </p>

        <h2>4. Pricing, Coupons, and Payments</h2>
        <p>
          Discounts and promotional codes (such as CRAVINGS50 or WELCOME100) are subject to terms
          and minimum order criteria. Prices charged include applicable taxes and packaging fees as
          indicated before checkout.
        </p>

        <h2>5. Need Help or Order Inquiries?</h2>
        <p>
          For questions regarding existing orders, refunds, or general account assistance, please
          visit our Help Center.
        </p>
        <Link to="/help-center" className="text-link">
          Visit the Help Center →
        </Link>
      </div>
    </main>
  );
};

export default TermsOfService;

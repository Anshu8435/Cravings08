import React from 'react';
import { Link } from 'react-router-dom';

const routes = [
  ['/', 'Home'],
  ['/order-now', 'Order Now (Catalog & Dishes)'],
  ['/about', 'About Us & Story'],
  ['/help-center', 'Help Center & FAQs'],
  ['/contact', 'Contact Support'],
  ['/feedback', 'Customer Feedback'],
  ['/login', 'User Sign In'],
  ['/register/customer', 'Customer Registration'],
  ['/register/restaurant', 'Restaurant Partner Registration'],
  ['/register/rider', 'Rider Partner Registration'],
  ['/customer-dashboard', 'Customer Account Dashboard'],
  ['/restaurant-dashboard', 'Restaurant Kitchen Dashboard'],
  ['/rider-dashboard', 'Delivery Rider Workspace'],
  ['/admin-dashboard', 'Platform Administrator Console'],
  ['/privacy-policy', 'Privacy Policy'],
  ['/terms-of-service', 'Terms of Service'],
  ['/test', 'System & Health Status'],
];

const SiteMap = () => {
  return (
    <main className="page-wrap wrap content-page">
      <div className="page-intro">
        <p className="eyebrow">SITE MAP</p>
        <h1>
          Every Cravings <em>corner.</em>
        </h1>
        <p>Browse all public pages, discovery routes, and role-based workspaces.</p>
      </div>

      <div className="sitemap-grid">
        {routes.map(([path, label]) => (
          <div key={path}>
            <Link to={path}>{label}</Link>
            <span>{path}</span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default SiteMap;

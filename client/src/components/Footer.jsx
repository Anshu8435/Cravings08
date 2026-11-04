import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation().pathname;

  if (location.toLowerCase().includes('dashboard')) return null;

  return (
    <footer className="site-footer">
      <div className="wrap footer-main">
        <div className="footer-brand">
          <Link className="brand" to="/" aria-label="Cravings home">
            <img src="/assets/cravings-mark.svg" alt="" />
            <span>
              Cravings<span className="brand-period">.</span>
            </span>
          </Link>
          <p>Your favorite food-delivery platform connecting customers, restaurants, and riders.</p>
        </div>
        <div className="footer-column">
          <strong>Explore</strong>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/order-now">Order now</Link>
        </div>
        <div className="footer-column">
          <strong>For partners</strong>
          <Link to="/register/restaurant">Partner with us</Link>
          <Link to="/restaurant-dashboard">Restaurant dashboard</Link>
          <Link to="/register/rider">Become a rider</Link>
        </div>
        <div className="footer-column">
          <strong>Help & feedback</strong>
          <Link to="/feedback">Submit feedback</Link>
          <Link to="/help-center">Help center</Link>
          <Link to="/contact">Contact us</Link>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 Cravings. All rights reserved.</span>
        <div>
          <Link to="/privacy-policy">Privacy policy</Link>
          <Link to="/terms-of-service">Terms of service</Link>
          <Link to="/site-map">Site map</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

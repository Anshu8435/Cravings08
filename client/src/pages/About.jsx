import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <main className="page-wrap wrap content-page">
      <div className="page-intro">
        <p className="eyebrow">OUR STORY</p>
        <h1>
          A little about <em>Cravings.</em>
        </h1>
        <p>The food-delivery platform connecting customers with restaurants and riders.</p>
      </div>

      <section className="story-panel">
        <div className="story-mark">C.</div>
        <div>
          <h2>Good food brings people together.</h2>
          <p>
            Cravings is built around a simple idea: finding a meal should feel easy, and every
            partner should have a place in the journey. From neighborhood kitchens to food lovers
            craving fresh artisanal dishes, we bridge the gap with speed, warmth, and culinary care.
          </p>
          <div className="story-pill-row">
            <span>Customers</span>
            <span>Restaurants</span>
            <span>Riders</span>
          </div>
        </div>
      </section>

      <div className="info-card-grid">
        <article>
          <span>01</span>
          <h3>Discover</h3>
          <p>
            Search curated restaurants, browse cuisine categories, and explore the interactive
            Craving Feed for real culinary inspirations.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Choose</h3>
          <p>
            Open a restaurant, explore the handcrafted menu, add dishes to your basket, and
            customize items with ease.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Connect</h3>
          <p>
            Customers, restaurant teams, and delivery partners have dedicated role workspaces to
            track orders from kitchen to doorstep.
          </p>
        </article>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/order-now" className="button button-primary">
          Explore restaurants now →
        </Link>
      </div>
    </main>
  );
};

export default About;

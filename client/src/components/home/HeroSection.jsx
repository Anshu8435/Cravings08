import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const slides = [
  {
    eyebrow: 'YOUR EVERYDAY FOOD FIX',
    title: 'Your favorite food,',
    titleEm: 'delivered fast.',
    copy: 'Find a dish worth looking forward to. Browse local favorites, follow a craving, and make mealtime easier.',
    image: '/assets/bitehero-food-hero.png',
    alt: 'A cheeseburger with golden fries on a warm table',
    action: 'Order now',
  },
  {
    eyebrow: 'A LITTLE COMFORT, RIGHT ON TIME',
    title: 'Make room for',
    titleEm: 'something delicious.',
    copy: 'From cozy pasta nights to a table full of favorites, choose what sounds good and start your order.',
    image: '/assets/bitehero-food-pasta.png',
    alt: 'Creamy rigatoni with tomato sauce and fresh basil',
    action: 'Explore the menu',
  },
  {
    eyebrow: 'FRESH PICKS FOR YOUR DAY',
    title: 'Follow the craving.',
    titleEm: 'Find the flavor.',
    copy: 'Search restaurants, browse cuisine, or switch to the Craving Feed for something new to try.',
    image: '/assets/bitehero-food-bowl.png',
    alt: 'A fresh grain bowl with roasted vegetables and greens',
    action: 'Find a restaurant',
  },
  {
    eyebrow: 'LOCAL FAVORITES, YOUR WAY',
    title: 'A better kind of',
    titleEm: 'dinner plan.',
    copy: 'Discover the menu, choose a restaurant, and make the next meal one less thing to plan.',
    image: '/assets/bitehero-food-hero.png',
    alt: 'A burger and fries ready for dinner',
    action: 'See what’s cooking',
  },
];

const HeroSection = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = slides[activeSlide];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/order-now${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  return (
    <section className="home-hero wrap" aria-label="Cravings food discovery">
      {/* Left Column Copy */}
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-dot"></span>
          {slide.eyebrow}
        </p>
        <h1>
          {slide.title} <em>{slide.titleEm}</em>
        </h1>
        <p className="hero-intro">{slide.copy}</p>

        <div className="hero-cta-row">
          <Link to="/order-now" className="button button-primary">
            {slide.action} <span aria-hidden="true">→</span>
          </Link>
          <Link to="/register/customer" className="underlined-link">
            Create an account
          </Link>
        </div>

        <form className="hero-search" onSubmit={handleSearchSubmit}>
          <label htmlFor="home-search">Find a restaurant or dish</label>
          <div className="search-input-wrap">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              id="home-search"
              name="search"
              type="search"
              placeholder="Search restaurants or dishes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="button button-primary" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Right Column Visual */}
      <div className="hero-visual">
        <div className="hero-halo"></div>
        <div className="hero-image-frame">
          <img id="hero-slide-image" src={slide.image} alt={slide.alt} fetchPriority="high" />
        </div>
        <div className="hero-seal">
          <span>MADE FOR</span>
          <strong>
            YOUR
            <br />
            CRAVINGS
          </strong>
          <span>ONE MEAL AT A TIME</span>
        </div>
        <div className="floating-food-note">
          <span className="note-star">✦</span>
          <span>
            <strong>Follow the flavor</strong>
            <small>Search, browse, and pick a favorite</small>
          </span>
        </div>
        <div className="carousel-controls" aria-label="Hero carousel">
          <button
            type="button"
            onClick={() => setActiveSlide((activeSlide + slides.length - 1) % slides.length)}
            aria-label="Previous slide"
          >
            ←
          </button>
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`slide-dot ${index === activeSlide ? 'is-active' : ''}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeSlide}
            ></button>
          ))}
          <button
            type="button"
            onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}
            aria-label="Next slide"
          >
            →
          </button>
          <button
            type="button"
            className="carousel-toggle"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={
              isPaused ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation'
            }
            aria-pressed={isPaused}
          >
            {isPaused ? '▶' : 'Ⅱ'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

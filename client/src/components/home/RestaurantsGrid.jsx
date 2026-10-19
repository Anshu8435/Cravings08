import React from 'react';
import { Link } from 'react-router-dom';
import CravingFeed from '../../components/CravingFeed';

const categoriesList = [
  { id: 'all', label: 'All', mark: '✳' },
  { id: 'veg', label: 'Vegetarian', mark: 'V' },
  { id: 'nonveg', label: 'Non-Veg', mark: 'N' },
  { id: 'dessert', label: 'Desserts', mark: 'S' },
  { id: 'others', label: 'Others', mark: '+' },
];

const RestaurantsGrid = ({
  viewMode,
  setViewMode,
  loading,
  filteredRestaurants,
  navigate,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <section className="discovery-section wrap" id="restaurants">
      {/* Section Heading Row */}
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">WHAT ARE YOU IN THE MOOD FOR?</p>
          <h2>Find your next favorite.</h2>
          <p className="section-copy">
            Browse verified restaurant kitchens or switch the view to explore the live Craving Feed.
          </p>
        </div>
        <span className="preview-note">Fresh daily specials · Verified kitchens</span>
      </div>

      {/* Discovery Toolbar */}
      <div className="discovery-toolbar">
        <div className="view-toggle" role="group" aria-label="Choose discovery view">
          <button
            type="button"
            className={viewMode === 'restaurants' ? 'is-active' : ''}
            onClick={() => setViewMode('restaurants')}
            aria-pressed={viewMode === 'restaurants'}
          >
            ▦ Restaurants
          </button>
          <button
            type="button"
            className={viewMode === 'feed' ? 'is-active' : ''}
            onClick={() => setViewMode('feed')}
            aria-pressed={viewMode === 'feed'}
          >
            ✦ Craving Feed
          </button>
        </div>

        {/* Category Pills */}
        <div className="category-row" role="group" aria-label="Filter by cuisine">
          {categoriesList.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`category-pill ${selectedCategory === item.id ? 'is-active' : ''}`}
              onClick={() => setSelectedCategory(item.id)}
              aria-pressed={selectedCategory === item.id}
            >
              <span className="category-mark" aria-hidden="true">
                {item.mark}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Discovery Results */}
      <div className="discovery-results">
        {viewMode === 'restaurants' ? (
          loading ? (
            <div className="restaurant-grid">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="restaurant-card"
                  style={{ minHeight: '280px', opacity: 0.6 }}
                >
                  <div
                    style={{
                      height: '180px',
                      background: 'var(--paper)',
                      borderBottom: '1px solid var(--line)',
                    }}
                  />
                  <div className="restaurant-card-body">
                    <div
                      style={{
                        height: '18px',
                        background: 'var(--line)',
                        borderRadius: '4px',
                        marginBottom: '8px',
                      }}
                    />
                    <div
                      style={{
                        height: '12px',
                        background: 'var(--line)',
                        borderRadius: '4px',
                        width: '60%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="restaurant-grid">
              {filteredRestaurants.map((restaurant) => {
                const restaurantImg =
                  restaurant.image && !restaurant.image.includes('placeholder')
                    ? restaurant.image
                    : '/assets/bitehero-food-hero.png';

                return (
                  <article key={restaurant.id} className="restaurant-card">
                    <Link
                      className="restaurant-image"
                      to={`/restaurant-details/${restaurant.id}`}
                      aria-label={`View ${restaurant.name}`}
                    >
                      <img
                        src={restaurantImg}
                        alt={`Food from ${restaurant.name}`}
                        loading="lazy"
                      />
                      <span className="sample-tag">VERIFIED KITCHEN</span>
                    </Link>
                    <div className="restaurant-card-body">
                      <div className="restaurant-title-line">
                        <h3>{restaurant.name}</h3>
                        <span className="sample-dot" aria-label="Verified partner">
                          •
                        </span>
                      </div>
                      <p>{restaurant.cuisines || restaurant.cuisine || 'Curated Culinary'}</p>
                      <div className="restaurant-meta">
                        <span>{restaurant.city || 'Express Delivery'}</span>
                        <span className="meta-separator">·</span>
                        <span>★ {restaurant.rating > 0 ? restaurant.rating : '4.8'}</span>
                      </div>
                      <Link className="card-link" to={`/restaurant-details/${restaurant.id}`}>
                        View menu <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-mark">⌕</span>
              <h3>No matching restaurants found</h3>
              <p>Try searching for a different dish or select another category filter.</p>
              <button
                type="button"
                className="button button-primary"
                onClick={() => setSelectedCategory('all')}
                style={{ marginTop: '12px' }}
              >
                Reset filter
              </button>
            </div>
          )
        ) : (
          <div className="feed-grid" style={{ gridColumn: '1 / -1' }}>
            <CravingFeed />
          </div>
        )}
      </div>
    </section>
  );
};

export default RestaurantsGrid;

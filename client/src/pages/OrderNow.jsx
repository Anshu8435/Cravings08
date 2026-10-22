import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../config/ApiConfig';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const categories = [
  { id: 'all', label: 'All', mark: '✳' },
  { id: 'veg', label: 'Vegetarian', mark: 'V' },
  { id: 'nonveg', label: 'Non-Veg', mark: 'N' },
  { id: 'dessert', label: 'Desserts', mark: 'S' },
  { id: 'others', label: 'Others', mark: '+' },
];

const OrderNow = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab');
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';

  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParam);

  const { cart, totalAmount, handleAddToCart, handleRemoveFromCart } = useCart();

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/public/restaurants');
      const list = (response.data.data || []).map((r) => ({
        id: r._id,
        name: r.restaurantName,
        cuisine: r.cuisineTypes ? r.cuisineTypes.join(' · ') : 'Gourmet Cuisine',
        city: r.city || 'Nearby',
        rating: r.averageRating || 4.8,
        note: `${r.cuisineType || 'Verified'} kitchen`,
        category: r.category || 'veg',
        image: r.coverImage?.url || r.restaurantImage?.[0]?.url || '/assets/bitehero-food-hero.png',
      }));
      setRestaurants(list);
      setFilteredRestaurants(list);
    } catch (error) {
      toast.error('Could not load restaurants. Showing available catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    let filtered = restaurants;

    if (searchParam.trim()) {
      const q = searchParam.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q),
      );
    }

    if (categoryParam !== 'all') {
      const categoryMap = {
        veg: 'veg',
        nonveg: 'non',
        dessert: 'dessert',
        others: 'other',
      };
      const match = categoryMap[categoryParam] || categoryParam;
      filtered = filtered.filter(
        (r) =>
          r.cuisine.toLowerCase().includes(match.toLowerCase()) ||
          (r.category && r.category.toLowerCase().includes(categoryParam.toLowerCase())),
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchParam, categoryParam, restaurants]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams((prev) => {
      if (searchInput.trim()) prev.set('search', searchInput.trim());
      else prev.delete('search');
      return prev;
    });
  };

  const handleCategorySelect = (id) => {
    setSearchParams((prev) => {
      if (id === 'all') prev.delete('category');
      else prev.set('category', id);
      return prev;
    });
  };

  // If URL has ?tab=cart, render the full Cart page layout from reference
  if (activeTab === 'cart') {
    return (
      <main className="page-wrap wrap">
        <div className="page-intro">
          <p className="eyebrow">YOUR ORDER</p>
          <h1>
            Shopping <em>cart.</em>
          </h1>
          <p>Quantities are saved in your active session. Ready to checkout whenever you are.</p>
        </div>

        {cart.length > 0 ? (
          <div className="cart-layout">
            <section className="cart-items">
              <div className="preview-note">Verified kitchen order · Express doorstep delivery</div>
              {cart.map((c) => (
                <article key={c.item._id} className="cart-row">
                  <div>
                    <strong>{c.item.itemName}</strong>
                    <small>₹{c.item.price} each · Fresh preparation</small>
                  </div>
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(c.item, false)}
                      aria-label="Remove one"
                    >
                      −
                    </button>
                    <span>{c.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(c.item)}
                      aria-label="Add one"
                    >
                      +
                    </button>
                  </div>
                  <strong>₹{c.item.price * c.quantity}</strong>
                </article>
              ))}
              <div className="cart-total">
                <span>Subtotal</span>
                <strong>₹{totalAmount}</strong>
              </div>
            </section>

            <aside className="checkout-card">
              <h2>Order summary</h2>
              <p>Total payable</p>
              <strong className="checkout-total">₹{totalAmount}</strong>
              <Link
                to="/order-now"
                className="button button-primary button-wide"
                style={{ textAlign: 'center', marginTop: '12px' }}
              >
                Browse more dishes
              </Link>
              <p className="checkout-disclaimer">
                Click on the cart button in the top navigation to select payment method and place
                your order.
              </p>
            </aside>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-mark">▢</span>
            <h2>Your cart is ready for a first pick.</h2>
            <p>Add a delicious dish from a restaurant menu to get started.</p>
            <Link to="/order-now" className="button button-primary" style={{ marginTop: '14px' }}>
              Browse restaurants →
            </Link>
          </div>
        )}
      </main>
    );
  }

  // Normal Order Now Catalog
  return (
    <main className="page-wrap wrap">
      <div className="page-intro">
        <p className="eyebrow">A TABLE FULL OF POSSIBILITIES</p>
        <h1>
          Order <em>now.</em>
        </h1>
        <p>
          Search verified restaurants and browse by cuisine. Freshly cooked, handcrafted meals
          delivered fast.
        </p>
      </div>

      {/* Search Input */}
      <form className="browse-search" onSubmit={handleSearchSubmit}>
        <label htmlFor="order-search">Search restaurants or dishes</label>
        <div className="search-input-wrap">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            id="order-search"
            type="search"
            name="search"
            placeholder="Try pasta, vegetarian, or a restaurant…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="button button-primary" type="submit">
            Search
          </button>
        </div>
      </form>

      {/* Category Filter Pills */}
      <div className="category-row" role="group" aria-label="Filter by cuisine">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`category-pill ${categoryParam === item.id ? 'is-active' : ''}`}
            onClick={() => handleCategorySelect(item.id)}
            aria-pressed={categoryParam === item.id}
          >
            <span className="category-mark" aria-hidden="true">
              {item.mark}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Section Heading Row */}
      <div className="section-heading-row compact-heading">
        <div>
          <h2>Restaurants for your next meal</h2>
          <p className="section-copy">
            {filteredRestaurants.length} verified{' '}
            {filteredRestaurants.length === 1 ? 'kitchen' : 'kitchens'} available.
          </p>
        </div>
        <span className="preview-note">Live kitchen partners</span>
      </div>

      {/* Restaurant Grid */}
      {isLoading ? (
        <div className="restaurant-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="restaurant-card" style={{ opacity: 0.6 }}>
              <div style={{ height: '180px', background: 'var(--cream)' }} />
              <div className="restaurant-card-body">
                <div style={{ height: '20px', background: 'var(--line)', marginBottom: '8px' }} />
                <div style={{ height: '14px', background: 'var(--line)', width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredRestaurants.length > 0 ? (
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => (
            <article key={restaurant.id} className="restaurant-card">
              <Link
                className="restaurant-image"
                to={`/restaurant-details/${restaurant.id}`}
                aria-label={`View ${restaurant.name}`}
              >
                <img src={restaurant.image} alt={`Food from ${restaurant.name}`} loading="lazy" />
                <span className="sample-tag">VERIFIED KITCHEN</span>
              </Link>
              <div className="restaurant-card-body">
                <div className="restaurant-title-line">
                  <h3>{restaurant.name}</h3>
                  <span className="sample-dot" aria-label="Verified partner">
                    •
                  </span>
                </div>
                <p>{restaurant.cuisine}</p>
                <div className="restaurant-meta">
                  <span>{restaurant.city}</span>
                  <span className="meta-separator">·</span>
                  <span>{restaurant.note}</span>
                </div>
                <Link className="card-link" to={`/restaurant-details/${restaurant.id}`}>
                  View menu <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-mark">⌕</span>
          <h3>No restaurants match this search</h3>
          <p>Try clearing your search query or choose another category filter.</p>
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              setSearchInput('');
              setSearchParams({});
            }}
            style={{ marginTop: '12px' }}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
};

export default OrderNow;

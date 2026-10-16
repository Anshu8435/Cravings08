import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../config/ApiConfig';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const RestaurantDetailsPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { isLogin } = useAuth();
  const { cart, handleAddToCart, handleRemoveFromCart } = useCart();

  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRestaurantDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/public/restaurant-detail/${restaurantId}`);
      setRestaurantDetails(response.data.data);
    } catch (error) {
      toast.error('Could not load restaurant menu. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
  }, [restaurantId]);

  const getItemQuantity = (itemId) => {
    const itemInCart = cart.find((c) => c.item._id === itemId);
    return itemInCart ? itemInCart.quantity : 0;
  };

  const onAddItem = (item) => {
    handleAddToCart({
      ...item,
      restaurantId: restaurantDetails?.restaurantId?._id || restaurantId,
    });
    toast.success(`${item.itemName} added to your basket`);
  };

  if (isLoading) {
    return (
      <main className="page-wrap wrap">
        <div className="empty-state" style={{ padding: '80px 20px' }}>
          <span className="empty-mark">⏳</span>
          <h2>Preparing menu details…</h2>
          <p>Connecting with kitchen to fetch latest dishes.</p>
        </div>
      </main>
    );
  }

  if (!restaurantDetails) {
    return (
      <main className="page-wrap wrap">
        <div className="empty-state" style={{ padding: '80px 20px' }}>
          <span className="empty-mark">⌕</span>
          <h2>Restaurant not found</h2>
          <p>We could not find the requested restaurant.</p>
          <Link to="/order-now" className="button button-primary" style={{ marginTop: '16px' }}>
            Back to restaurants →
          </Link>
        </div>
      </main>
    );
  }

  const restaurant = restaurantDetails.restaurantId;
  const menuItems = restaurantDetails.menuItems || [];

  const defaultRestaurantImage = '/assets/bitehero-food-hero.png';
  const restaurantImage =
    restaurant?.coverImage?.url || restaurant?.restaurantImage?.[0]?.url || defaultRestaurantImage;

  return (
    <main className="page-wrap wrap">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/order-now">Order now</Link>
        <span>›</span>
        <span>{restaurant.restaurantName}</span>
      </div>

      {/* Hero Banner */}
      <section className="restaurant-detail-hero">
        <img src={restaurantImage} alt={restaurant.restaurantName} />
        <div className="restaurant-detail-overlay">
          <span className="sample-tag">VERIFIED KITCHEN</span>
          <p className="eyebrow eyebrow-light">
            {restaurant.cuisineTypes ? restaurant.cuisineTypes.join(' · ') : 'Curated Cuisine'}
          </p>
          <h1>{restaurant.restaurantName}</h1>
          <p>
            {restaurant.address || restaurant.city || 'Express Delivery'} · Verified Cravings
            Partner
          </p>
        </div>
      </section>

      {/* Detail Meta Strip */}
      <div className="detail-meta-strip">
        <span>
          <strong>Rating</strong>
          <small>
            ★ {restaurant.averageRating || '4.8'} ({restaurant.numReviews || 24} reviews)
          </small>
        </span>
        <span>
          <strong>Hours</strong>
          <small>
            {restaurant.openingHours || '10:00 AM'} – {restaurant.closingHours || '11:00 PM'}
          </small>
        </span>
        <span>
          <strong>Delivery</strong>
          <small>Express doorstep delivery in ~28 mins</small>
        </span>
      </div>

      {/* Heading */}
      <div className="section-heading-row compact-heading">
        <div>
          <p className="eyebrow">MADE FOR YOUR CRAVING</p>
          <h2>Explore the menu.</h2>
        </div>
        <span className="preview-note">{menuItems.length} dishes available</span>
      </div>

      {/* Dish Grid */}
      {menuItems.length > 0 ? (
        <div className="dish-grid">
          {menuItems.map((dish) => {
            const quantity = getItemQuantity(dish._id);
            const isUnavailable = dish.status === 'unavailable' || dish.status === 'discontinued';
            const dishImage =
              dish.image?.url || dish.itemImage?.url || '/assets/bitehero-food-pasta.png';

            return (
              <article
                key={dish._id}
                className="dish-card"
                style={{ opacity: isUnavailable ? 0.7 : 1 }}
              >
                <img src={dishImage} alt={dish.itemName} loading="lazy" />
                <div className="dish-card-copy">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <span className="dish-category">
                      {dish.category || (dish.isVeg ? 'Vegetarian' : 'Chef Special')}
                    </span>
                    {isUnavailable && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          color: 'var(--red)',
                          background: 'rgba(180, 58, 47, 0.12)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid rgba(180, 58, 47, 0.25)',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Unavailable
                      </span>
                    )}
                  </div>
                  <h3>{dish.itemName}</h3>
                  <p>{dish.description || 'Artisanal ingredients, freshly prepared to order.'}</p>
                  <div className="dish-card-bottom">
                    <strong>₹{dish.price}</strong>
                    {isUnavailable ? (
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          color: 'var(--muted)',
                          background: 'var(--paper)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--line)',
                        }}
                      >
                        Sold out
                      </span>
                    ) : quantity > 0 ? (
                      <div className="quantity-control">
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(dish, false)}
                          aria-label="Remove one"
                        >
                          −
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleAddToCart({ ...dish, restaurantId: restaurant._id })}
                          aria-label="Add one"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="add-button"
                        onClick={() => onAddItem(dish)}
                        aria-label={`Add ${dish.itemName} to cart`}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-mark">▢</span>
          <h3>No dishes currently listed</h3>
          <p>This restaurant is currently preparing its seasonal menu.</p>
        </div>
      )}
    </main>
  );
};

export default RestaurantDetailsPage;

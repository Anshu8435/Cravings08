import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { loadRazorpayScript } from '../utils/loadRazorpay';
import ReceiptModal from './payment/ReceiptModal';
import api from '../config/ApiConfig';
import toast from 'react-hot-toast';
import { IoCloseOutline } from 'react-icons/io5';

const Navbar = () => {
  const { user, isLogin, role, setUser, setIsLogin, setRole } = useAuth();
  const navigate = useNavigate();
  const { totalItems, cart, totalAmount, handleAddToCart, handleRemoveFromCart, clearCart } =
    useCart();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [receiptData, setReceiptData] = React.useState(null);
  const [orderType, setOrderType] = React.useState('instant');
  const [paymentMethod, setPaymentMethod] = React.useState('upi');
  const [couponCode, setCouponCode] = React.useState('');
  const [discount, setDiscount] = React.useState(0);

  const finalAmount = Math.max(0, totalAmount - discount);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'CRAVINGS50') {
      setDiscount(50);
      toast.success('Coupon CRAVINGS50 applied! ₹50 OFF');
    } else if (code === 'WELCOME100') {
      setDiscount(100);
      toast.success('Coupon WELCOME100 applied! ₹100 OFF');
    } else {
      toast.error('Invalid coupon code. Try CRAVINGS50 or WELCOME100');
    }
  };

  React.useEffect(() => {
    if (totalItems === 0 && isCartOpen) {
      setIsCartOpen(false);
    }
  }, [totalItems, isCartOpen]);

  const handleNavigateToDashboard = () => {
    if (role === 'restaurant') {
      navigate('/restaurant-dashboard', { state: { activeTab: 'settings' } });
    } else if (role === 'rider') {
      navigate('/rider-dashboard', { state: { activeTab: 'settings' } });
    } else if (role === 'admin') {
      navigate('/admin-dashboard', { state: { activeTab: 'settings' } });
    } else {
      navigate('/customer-dashboard', { state: { activeTab: 'settings' } });
    }
  };

  const handleLogout = async () => {
    try {
      const res = await api.get('/auth/logout');
      toast.success(res.data.message || 'Logged out successfully');

      sessionStorage.removeItem('cravingUser');
      sessionStorage.removeItem('cravingToken');
      localStorage.removeItem('cravingToken');
      setUser(null);
      setIsLogin(false);
      setRole(null);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error logging out');
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLogin) {
      toast.error('Please login first to place an order');
      navigate('/login');
      return;
    }
    if (role !== 'customer') {
      toast.error('Only customer accounts can place orders');
      return;
    }
    if (!cart?.length) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsCheckingOut(true);
      const restaurantId = cart[0].item.restaurantId;

      const getGeoLocation = () => {
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            resolve(null);
          } else {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  lat: position.coords.latitude.toString(),
                  lon: position.coords.longitude.toString(),
                });
              },
              () => resolve(null),
              { timeout: 5000, maximumAge: 0, enableHighAccuracy: true },
            );
          }
        });
      };

      const geoLocation = await getGeoLocation();

      const createOrderRes = await api.post('/order/create', {
        restaurantId,
        paymentMethod,
        orderType,
        amount: finalAmount,
        orderItems: cart.map((c) => ({ itemId: c.item._id, quantity: c.quantity })),
        geoLocation,
      });

      const appOrderId = createOrderRes?.data?.data?._id;

      if (!appOrderId) {
        throw new Error('Failed to create order');
      }

      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully via Cash on Delivery!');
        setIsCartOpen(false);
        setReceiptData({
          razorpay_order_id: 'COD-' + (appOrderId || '').slice(-6).toUpperCase(),
          razorpay_payment_id: 'CASH-ON-DELIVERY',
          amount: finalAmount,
          items: cart,
        });
        clearCart();
        navigate('/customer-dashboard');
        return;
      }

      // Razorpay Online Flow
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Payment gateway failed to initialize. Please check connection.');
        return;
      }

      const razorpayOrderRes = await api.post('/order/razorpay-order', {
        amount: finalAmount,
      });

      const { id: razorpay_order_id, amount, currency } = razorpayOrderRes.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount,
        currency,
        name: 'Cravings Delivery',
        description: `Order #${appOrderId.slice(-6).toUpperCase()}`,
        image: '/assets/cravings-mark.svg',
        order_id: razorpay_order_id,
        handler: async (response) => {
          try {
            await api.post('/order/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              appOrderId,
            });

            toast.success('Payment verified! Your meal is being prepared.');
            setIsCartOpen(false);
            setReceiptData({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              amount: finalAmount,
              items: cart,
            });
            clearCart();
            navigate('/customer-dashboard');
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.fullName || 'Customer',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#b43a2f',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(response.error.description || 'Payment failed');
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong during checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <header className="public-header">
        <div className="header-inner wrap">
          {/* Brand */}
          <Link to="/" className="brand" aria-label="Cravings home">
            <img src="/assets/cravings-mark.svg" alt="" />
            <span>
              Cravings<span className="brand-period">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="main-nav" aria-label="Main navigation">
            <Link to="/">Home</Link>
            <Link to="/order-now">Order now</Link>
            <Link to="/about">About</Link>
            <Link to="/help-center">Help</Link>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {isLogin ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleNavigateToDashboard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--cream)',
                    border: '1px solid var(--line)',
                    padding: '4px 12px 4px 6px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                  }}
                  title="Go to Dashboard"
                >
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--red)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                    }}
                  >
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--ink)',
                    }}
                  >
                    {user?.fullName?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-link"
                  style={{ fontSize: '0.82rem', color: 'var(--muted)', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-link">
                  Login
                </Link>
                <Link to="/register/customer" className="button button-small">
                  Join Cravings
                </Link>
              </>
            )}

            {/* Cart Button */}
            <button
              type="button"
              className="cart-link"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
            >
              <span className="cart-mark" aria-hidden="true">
                👜
              </span>
              <span className="cart-count">{totalItems}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="mobile-menu-toggle"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer - Only displayed when toggled on mobile view */}
        {isMobileMenuOpen && (
          <nav className="mobile-nav wrap" aria-label="Mobile navigation">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <span aria-hidden="true">🏠</span> Home
            </Link>
            <Link to="/order-now" onClick={() => setIsMobileMenuOpen(false)}>
              <span aria-hidden="true">🍽️</span> Order now
            </Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
              <span aria-hidden="true">📖</span> About Us
            </Link>
            <Link to="/help-center" onClick={() => setIsMobileMenuOpen(false)}>
              <span aria-hidden="true">💬</span> Help Center
            </Link>
            <Link to="/feedback" onClick={() => setIsMobileMenuOpen(false)}>
              <span aria-hidden="true">⭐</span> Feedback
            </Link>

            <div className="mobile-nav-divider" />

            {isLogin ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    background: 'var(--paper)',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                  }}
                >
                  <span
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'var(--red)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                    }}
                  >
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '0.88rem',
                        color: 'var(--ink)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user?.fullName || 'User Account'}
                    </strong>
                    <small
                      style={{
                        color: 'var(--muted)',
                        textTransform: 'capitalize',
                        fontSize: '0.74rem',
                      }}
                    >
                      {role || 'Customer'} space
                    </small>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigateToDashboard();
                  }}
                  className="button button-small button-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Go to {role ? role.charAt(0).toUpperCase() + role.slice(1) : ''} Dashboard →
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  style={{
                    color: 'var(--red)',
                    justifyContent: 'center',
                    padding: '8px',
                    fontSize: '0.85rem',
                  }}
                >
                  Logout from session
                </button>
              </div>
            ) : (
              <div>
                <div className="mobile-nav-actions">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="button button-small button-secondary"
                    style={{ justifyContent: 'center' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register/customer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="button button-small button-primary"
                    style={{ justifyContent: 'center' }}
                  >
                    Join Cravings
                  </Link>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--line)',
                    fontSize: '0.8rem',
                  }}
                >
                  <Link
                    to="/register/restaurant"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ padding: '4px', color: 'var(--muted)', fontSize: '0.78rem' }}
                  >
                    Partner with us →
                  </Link>
                  <Link
                    to="/register/rider"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ padding: '4px', color: 'var(--muted)', fontSize: '0.78rem' }}
                  >
                    Become a rider →
                  </Link>
                </div>
              </div>
            )}
          </nav>
        )}
      </header>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(40, 38, 31, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              background: 'var(--cream)',
              borderLeft: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-float)',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid var(--line)',
                background: 'var(--paper)',
              }}
            >
              <div>
                <p className="eyebrow" style={{ margin: 0, fontSize: '0.68rem' }}>
                  YOUR BASKET
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.45rem',
                    color: 'var(--ink)',
                  }}
                >
                  Shopping cart
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: 'none',
                  border: '1px solid var(--line)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--ink)',
                }}
                aria-label="Close cart"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>

            {/* Cart Content */}
            <div style={{ flex: 1, padding: '20px 24px' }}>
              {cart.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 10px' }}>
                  <span className="empty-mark">▢</span>
                  <h3>Your basket is empty</h3>
                  <p>Explore restaurants and add your favorite dishes.</p>
                  <Link
                    to="/order-now"
                    className="button button-primary"
                    onClick={() => setIsCartOpen(false)}
                    style={{ marginTop: '14px' }}
                  >
                    Explore menu →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div
                    style={{
                      background: 'rgba(180, 58, 47, 0.08)',
                      border: '1px solid rgba(180, 58, 47, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.78rem',
                      color: 'var(--red)',
                      fontWeight: '600',
                    }}
                  >
                    ★ Free delivery unlocked on orders above ₹499
                  </div>

                  {/* Cart Item Rows */}
                  {cart.map((c) => (
                    <article
                      key={c.item._id}
                      className="cart-row"
                      style={{
                        padding: '14px 0',
                        borderBottom: '1px solid var(--line)',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto',
                        gap: '12px',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            display: 'block',
                            fontSize: '0.94rem',
                            color: 'var(--ink)',
                            fontWeight: '600',
                          }}
                        >
                          {c.item.itemName}
                        </strong>
                        <small style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                          ₹{c.item.price} each
                        </small>
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

                      <strong style={{ fontSize: '0.98rem', color: 'var(--ink)' }}>
                        ₹{c.item.price * c.quantity}
                      </strong>
                    </article>
                  ))}

                  {/* Coupon Code Input */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Coupon code (CRAVINGS50)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid var(--line)',
                          borderRadius: '8px',
                          background: 'var(--paper)',
                          fontSize: '0.85rem',
                          color: 'var(--ink)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="button button-small"
                      >
                        Apply
                      </button>
                    </div>
                    {discount > 0 && (
                      <p
                        style={{
                          color: 'var(--green)',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          marginTop: '4px',
                        }}
                      >
                        ✓ Coupon applied: -₹{discount}
                      </p>
                    )}
                  </div>

                  {/* Delivery Mode & Payment Selector */}
                  <div
                    style={{
                      background: 'var(--paper)',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginTop: '6px',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'var(--muted)',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Delivery mode
                      </span>
                      <div
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}
                      >
                        {['instant', 'scheduled', 'pickup'].map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setOrderType(mode)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border:
                                orderType === mode
                                  ? '1px solid var(--red)'
                                  : '1px solid var(--line)',
                              background: orderType === mode ? 'var(--red)' : 'var(--cream)',
                              color: orderType === mode ? '#fff' : 'var(--ink)',
                              fontSize: '0.78rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              textTransform: 'capitalize',
                            }}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'var(--muted)',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Payment method
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border:
                              paymentMethod === 'upi'
                                ? '1px solid var(--red)'
                                : '1px solid var(--line)',
                            background:
                              paymentMethod === 'upi' ? 'rgba(180, 58, 47, 0.1)' : 'var(--cream)',
                            color: paymentMethod === 'upi' ? 'var(--red)' : 'var(--ink)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            justifyContent: 'center',
                          }}
                        >
                          <span>💳</span> Online / UPI
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cod')}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border:
                              paymentMethod === 'cod'
                                ? '1px solid var(--red)'
                                : '1px solid var(--line)',
                            background:
                              paymentMethod === 'cod' ? 'rgba(180, 58, 47, 0.1)' : 'var(--cream)',
                            color: paymentMethod === 'cod' ? 'var(--red)' : 'var(--ink)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            justifyContent: 'center',
                          }}
                        >
                          <span>💵</span> Cash on delivery
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary Totals */}
                  <div
                    style={{
                      borderTop: '1px solid var(--line)',
                      paddingTop: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '0.86rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'var(--muted)',
                      }}
                    >
                      <span>Subtotal</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    {discount > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          color: 'var(--green)',
                        }}
                      >
                        <span>Discount</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'var(--muted)',
                      }}
                    >
                      <span>Delivery charge</span>
                      <span>{totalAmount >= 499 ? 'FREE' : '₹40'}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '1.15rem',
                        fontWeight: '800',
                        color: 'var(--ink)',
                        borderTop: '1px dashed var(--line)',
                        paddingTop: '8px',
                        marginTop: '4px',
                        fontFamily: "'Fraunces', Georgia, serif",
                      }}
                    >
                      <span>Total</span>
                      <span>₹{finalAmount + (totalAmount >= 499 ? 0 : 40)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    type="button"
                    className="button button-primary button-wide"
                    disabled={isCheckingOut}
                    onClick={handlePlaceOrder}
                    style={{ marginTop: '8px', padding: '14px 20px', fontSize: '0.95rem' }}
                  >
                    {isCheckingOut
                      ? 'Processing order…'
                      : `Place order (₹${finalAmount + (totalAmount >= 499 ? 0 : 40)})`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptData && (
        <ReceiptModal receiptData={receiptData} onClose={() => setReceiptData(null)} />
      )}
    </>
  );
};

export default Navbar;

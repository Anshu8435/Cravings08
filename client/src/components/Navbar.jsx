import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoLight from '../assets/transparentLogoLight.png';
import { useAuth } from '../context/AuthContext';
import { FaPowerOff } from 'react-icons/fa';
import { IoCartOutline, IoCloseOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import api from '../config/ApiConfig';
import { useCart } from '../context/CartContext';
import { loadRazorpayScript } from '../utils/loadRazorpay';
import ReceiptModal from './payment/ReceiptModal';

const Navbar = () => {
  const { user, isLogin, role, setUser, setIsLogin, setRole } = useAuth();
  const navigate = useNavigate();
  const { totalItems, cart, totalAmount, handleAddToCart, handleRemoveFromCart, clearCart } =
    useCart();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
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

  const handleNavigate = () => {
    //console.log("Handle Navigate", role);

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
      toast.success(res.data.message);

      sessionStorage.removeItem('cravingUser');
      sessionStorage.removeItem('cravingToken');
      localStorage.removeItem('cravingToken');
      setUser(null);
      setIsLogin(false);
      setRole(null);
      navigate('/');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Unknown error occurred during registration. Please try again.',
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLogin) {
      toast.error('Please login first');
      return;
    }
    if (role !== 'customer') {
      toast.error('Only customers can order');
      return;
    }
    if (!cart?.length) {
      toast.error('Cart is empty');
      return;
    }

    try {
      setIsCheckingOut(true);

      const restaurantId = cart[0].item.restaurantId;

      // Attempt to get user's live geolocation
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
        toast.success('Order placed successfully via Cash on Delivery (COD)!');
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

      const paymentOrderRes = await api.post('/payment/create-order', { orderId: appOrderId });
      const paymentData = paymentOrderRes?.data?.data;
      const isMock = paymentOrderRes?.data?.isMock;

      if (isMock) {
        await api.post('/payment/verify', {
          orderId: appOrderId,
          razorpay_order_id: paymentData.razorpayOrderId,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'mock_signature',
        });

        toast.success('Payment successful!');
        setIsCartOpen(false);
        setReceiptData({
          razorpay_order_id: paymentData.razorpayOrderId,
          razorpay_payment_id: `PAY-MOCK-${(appOrderId || '').slice(-6).toUpperCase()}`,
          amount: totalAmount,
          items: cart,
        });
        clearCart();
        navigate('/customer-dashboard');
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setIsCheckingOut(false);
        return;
      }

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Cravings Delivery',
        description: 'Food Order Payment',
        order_id: paymentData.razorpayOrderId,

        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payment/verify', {
              orderId: appOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success('Payment successful!');
            setIsCartOpen(false);
            setReceiptData({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              amount: totalAmount,
              items: cart,
            });
            clearCart();
            navigate('/customer-dashboard');
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.fullName || user?.name || 'Test User',
          email: user?.email || 'test@example.com',
          contact: user?.phone || '9999999999',
        },
        theme: { color: '#ea580c' },
        modal: {
          ondismiss: () => toast.error('Payment cancelled'),
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 lg:px-12 bg-[#080a11]/90 backdrop-blur-xl text-white w-full h-18 shadow-2xl border-b border-white/10 transition-all">
        {/* Brand Logo */}
        <div className="h-full flex items-center">
          <Link
            to="/"
            className="h-11 flex items-center group transition-transform duration-300 hover:scale-105"
          >
            <img
              src={logoLight}
              alt="Cravings"
              className="w-auto h-full object-contain filter drop-shadow-sm"
            />
          </Link>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide text-white/90">
          <Link to="/" className="hover:text-white transition-colors py-1 relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/order-now" className="hover:text-white transition-colors py-1 relative group">
            Restaurants
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="hover:text-white transition-colors py-1 relative group">
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors py-1 relative group">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3 sm:gap-4 h-full">
          {/* Cart Pill Trigger */}
          {totalItems > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#ff5400] to-[#e11d48] hover:from-[#e04800] hover:to-[#cc163d] text-white font-extrabold px-4 py-2 rounded-full border border-white/10 transition-all duration-300 shadow-lg shadow-[#ff5400]/25 hover:scale-105 active:scale-95 focus:outline-none"
              title="View Cart"
            >
              <IoCartOutline size={20} className="stroke-2" />
              <span className="hidden sm:inline text-xs uppercase tracking-wider font-black">
                Cart
              </span>
              <span className="bg-white text-gray-900 font-black text-xs px-2 py-0.5 rounded-full shadow-xs">
                {totalItems}
              </span>
            </button>
          )}

          {isLogin ? (
            <div className="flex items-center bg-white/15 hover:bg-white/25 border border-white/25 transition-all duration-300 rounded-full pr-1.5 pl-1.5 py-1 shadow-md backdrop-blur-md group">
              <button
                className="flex items-center gap-2.5 cursor-pointer text-left focus:outline-none"
                title="Go to Dashboard"
                onClick={handleNavigate}
              >
                <div className="relative">
                  <img
                    src={
                      user?.photo?.url ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
                    }
                    alt={user?.fullName || 'User'}
                    className="w-9 h-9 rounded-full object-cover object-top ring-2 ring-white/50 group-hover:ring-white transition-all duration-300"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#ff5200] rounded-full"></div>
                </div>
                <div className="hidden sm:flex flex-col mr-2">
                  <span className="text-xs font-extrabold text-white leading-tight">
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                    {role}
                  </span>
                </div>
              </button>

              <div className="w-px h-6 bg-white/20 mx-1"></div>

              <button
                onClick={handleLogout}
                className="text-white/80 hover:text-white hover:bg-red-500/80 p-2 rounded-full transition-all duration-300 flex items-center justify-center focus:outline-none"
                title="Logout"
              >
                <FaPowerOff size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-full hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register/customer"
                className="bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white font-black text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full shadow-lg shadow-[#ff5400]/25 hover:shadow-[#ff5400]/40 hover:scale-105 active:scale-95 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Cart Modal Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-100 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-500"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="w-full sm:w-105 h-full shadow-2xl flex flex-col transform transition-transform duration-500 translate-x-0 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-orange-50/80 via-white to-white dark:from-orange-950/20 dark:via-gray-900 dark:to-gray-900">
              <div className="flex items-center gap-3">
                <div className="bg-[#ff5200]/10 text-[#ff5200] p-2.5 rounded-2xl">
                  <IoCartOutline size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Your Gourmet Cart
                  </h2>
                  <p className="text-xs text-gray-500 font-semibold">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in basket
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-700 dark:hover:text-white group"
              >
                <IoCloseOutline
                  size={24}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </div>

            {/* Free Delivery Progress Bar */}
            <div className="px-5 py-3 bg-orange-50/60 dark:bg-orange-950/20 border-b border-orange-100/60 dark:border-orange-900/30">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span>🚀</span>
                  {totalAmount >= 499
                    ? 'Free Express Delivery Unlocked!'
                    : `Add ₹${Math.max(0, 499 - totalAmount)} more for Free Express Delivery`}
                </span>
                <span className="text-[#ff5200] font-black">
                  {Math.min(100, Math.round((totalAmount / 499) * 100))}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#ff5200] to-amber-500 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (totalAmount / 499) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#faf9f6]/50 dark:bg-black/20 custom-scrollbar">
              {cart.map((c) => {
                const itemImage =
                  c.item.image?.url ||
                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop';
                return (
                  <div
                    key={c.item._id}
                    className="flex gap-3.5 p-3.5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700/60 transform hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={itemImage}
                        alt={c.item.itemName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-[#ff5200] transition-colors">
                          {c.item.itemName}
                        </h4>
                        <p className="text-[#ff5200] font-black text-sm mt-0.5">₹{c.item.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 border border-gray-200/60 dark:border-gray-600/60">
                          <button
                            onClick={() => handleRemoveFromCart(c.item, false)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-gray-600 shadow-xs hover:bg-[#ff5200] hover:text-white text-[#ff5200] dark:text-orange-400 font-black text-base transition-all active:scale-90"
                          >
                            −
                          </button>
                          <span className="font-black text-gray-900 dark:text-gray-100 min-w-6 text-center text-xs">
                            {c.quantity}
                          </span>
                          <button
                            onClick={() => handleAddToCart(c.item)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-gray-600 shadow-xs hover:bg-[#ff5200] hover:text-white text-[#ff5200] dark:text-orange-400 font-black text-base transition-all active:scale-90"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-black text-gray-900 dark:text-white text-base">
                          ₹{c.item.price * c.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.08)] relative z-10 space-y-4">
              {/* Order Type Selector */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">
                  Delivery Mode
                </span>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
                  {['instant', 'scheduled', 'pickup'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`py-1.5 rounded-lg capitalize transition-all ${orderType === type
                          ? 'bg-[#ff5200] text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">
                  Payment Method
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 px-3 rounded-xl border text-left transition-all flex items-center gap-2 ${paymentMethod === 'upi'
                        ? 'border-[#ff5200] bg-orange-50/80 dark:bg-orange-950/30 text-[#ff5200] font-black shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    <span>💳</span>
                    <span>Online / UPI</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2 px-3 rounded-xl border text-left transition-all flex items-center gap-2 ${paymentMethod === 'cod'
                        ? 'border-[#ff5200] bg-orange-50/80 dark:bg-orange-950/30 text-[#ff5200] font-black shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    <span>💵</span>
                    <span>Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Coupon Box & Quick Suggestions */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. CRAVINGS50)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 uppercase font-bold focus:outline-none focus:border-[#ff5200]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {/* One-tap Chips */}
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode('CRAVINGS50');
                      setDiscount(50);
                      toast.success('Coupon CRAVINGS50 applied! ₹50 OFF');
                    }}
                    className="text-[10px] font-black text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-900/40 transition"
                  >
                    🏷️ CRAVINGS50 (-₹50)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode('WELCOME100');
                      setDiscount(100);
                      toast.success('Coupon WELCOME100 applied! ₹100 OFF');
                    }}
                    className="text-[10px] font-black text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/40 transition"
                  >
                    🎉 WELCOME100 (-₹100)
                  </button>
                </div>
              </div>

              {/* Bill Details */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Item Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-bold">₹{totalAmount}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs pb-1">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    Delivery Fee
                  </span>
                  <span className="text-emerald-600 font-black tracking-wide uppercase">
                    {orderType === 'pickup' ? 'N/A (Pickup)' : 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white font-black text-base">
                    Grand Total
                  </span>
                  <span className="text-2xl font-black text-[#ff5200]">₹{finalAmount}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isCheckingOut}
                className="w-full bg-linear-to-r from-[#ff5200] via-[#f75d16] to-[#eb4a04] hover:opacity-95 text-white py-3.5 rounded-2xl font-black text-base transition-all shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isCheckingOut ? 'Processing Order...' : 'Proceed to Checkout'}
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
              </button>
            </div>
          </div>
        </div>
      )}
      <ReceiptModal
        isOpen={!!receiptData}
        onClose={() => setReceiptData(null)}
        data={receiptData}
      />
    </>
  );
};

export default Navbar;

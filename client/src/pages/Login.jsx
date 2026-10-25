import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/ApiConfig';
import { useAuth } from '../context/AuthContext';
import ForgotPasswordModal from '../components/commonModals/ForgotPasswordModal';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLogin, setRole } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.email.trim()) newErrors.email = 'Email address is required';
    if (!data.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: formData.email.toLowerCase(),
        password: formData.password,
      });
      toast.success(res.data.message || 'Welcome back!');
      sessionStorage.setItem('cravingUser', JSON.stringify(res.data.data));
      if (res.data.token) {
        sessionStorage.setItem('cravingToken', res.data.token);
        localStorage.setItem('cravingToken', res.data.token);
      }
      setUser(res.data.data);
      setIsLogin(true);
      setRole(res.data.data.userType);

      if (res.data.data.userType === 'restaurant') navigate('/restaurant-dashboard');
      else if (res.data.data.userType === 'rider') navigate('/rider-dashboard');
      else if (res.data.data.userType === 'admin') navigate('/admin-dashboard');
      else navigate('/customer-dashboard');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Login failed. Please check your credentials and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="auth-page wrap">
        {/* Left Hero Art */}
        <section className="auth-art">
          <img src="/assets/bitehero-food-hero.png" alt="A favorite meal ready to explore" />
          <div className="auth-art-label">
            <span className="eyebrow eyebrow-light">WELCOME BACK</span>
            <h2>Your next favorite is close.</h2>
          </div>
        </section>

        {/* Right Auth Card */}
        <section className="auth-card">
          <p className="eyebrow">GOOD TO SEE YOU</p>
          <h1>Welcome back.</h1>
          <p className="section-copy">
            Sign in to continue to your role-based Cravings space and manage your orders.
          </p>

          <form className="stacked-form" onSubmit={handleSubmit}>
            <label>
              Email address
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && (
                <span style={{ color: 'var(--red)', fontSize: '0.78rem' }}>{errors.email}</span>
              )}
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {errors.password && (
                <span style={{ color: 'var(--red)', fontSize: '0.78rem' }}>{errors.password}</span>
              )}
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}>
              <button
                type="button"
                onClick={() => setIsForgotPasswordModalOpen(true)}
                className="text-link"
                style={{
                  fontSize: '0.82rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              className="button button-primary button-wide"
              type="submit"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Signing in…' : 'Sign in to Cravings'}
            </button>
          </form>

          <div className="auth-switch">
            New to Cravings? <Link to="/register/customer">Create an account</Link>
          </div>

          <div className="role-links">
            <span>Register as partner:</span>
            <Link to="/register/restaurant">Restaurant</Link>
            <Link to="/register/rider">Rider</Link>
          </div>
        </section>
      </main>

      {/* Forgot Password Modal */}
      {isForgotPasswordModalOpen && (
        <ForgotPasswordModal
          open={isForgotPasswordModalOpen}
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
        />
      )}
    </>
  );
};

export default Login;

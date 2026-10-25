import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../config/ApiConfig';

const Register = () => {
  const { userType: routeUserType } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userType: routeUserType || 'customer',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!data.email.trim()) newErrors.email = 'Email address is required';
    if (!data.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!data.password || data.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (data.password !== data.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!data.agreeTerms) newErrors.agreeTerms = 'You must agree to the Terms of Service';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        ...formData,
        email: formData.email.toLowerCase(),
      });
      toast.success(res.data.message || 'Account created successfully! Please sign in.');
      navigate('/login');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page wrap">
      {/* Left Art */}
      <section className="auth-art">
        <img src="/assets/bitehero-food-hero.png" alt="A favorite meal ready to explore" />
        <div className="auth-art-label">
          <span className="eyebrow eyebrow-light">A SEAT AT THE TABLE</span>
          <h2>Let’s make mealtime easier.</h2>
        </div>
      </section>

      {/* Right Form Card */}
      <section className="auth-card">
        <p className="eyebrow">JOIN CRAVINGS</p>
        <h1>Create an account.</h1>
        <p className="section-copy">
          Select your role and start your journey with India's premier artisanal food delivery
          platform.
        </p>

        <form className="stacked-form" onSubmit={handleSubmit}>
          <label>
            Account type
            <select name="userType" value={formData.userType} onChange={handleInputChange}>
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant Partner</option>
              <option value="rider">Delivery Rider</option>
            </select>
          </label>

          <label>
            Full name
            <input
              name="fullName"
              type="text"
              placeholder="Your name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            {errors.fullName && (
              <span style={{ color: 'var(--red)', fontSize: '0.78rem' }}>{errors.fullName}</span>
            )}
          </label>

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
            Phone number
            <input
              name="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            {errors.phone && (
              <span style={{ color: 'var(--red)', fontSize: '0.78rem' }}>{errors.phone}</span>
            )}
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {errors.password && (
              <span style={{ color: 'var(--red)', fontSize: '0.78rem' }}>{errors.password}</span>
            )}
          </label>

          <label>
            Confirm password
            <input
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            {errors.confirmPassword && (
              <span style={{ color: 'var(--red)', fontSize: '0.78rem' }}>
                {errors.confirmPassword}
              </span>
            )}
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              name="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              style={{ width: 'auto' }}
            />
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              I agree to the{' '}
              <Link to="/terms-of-service" className="text-link">
                Terms of Service
              </Link>{' '}
              &{' '}
              <Link to="/privacy-policy" className="text-link">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeTerms && (
            <span style={{ color: 'var(--red)', fontSize: '0.78rem' }}>{errors.agreeTerms}</span>
          )}

          <button
            className="button button-primary button-wide"
            type="submit"
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Creating account…' : 'Create Cravings account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </section>
    </main>
  );
};

export default Register;

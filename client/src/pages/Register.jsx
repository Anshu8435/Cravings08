import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  IoSparklesOutline,
  IoPersonOutline,
  IoRestaurantOutline,
  IoBicycleOutline,
} from 'react-icons/io5';
import api from '../config/ApiConfig';

const Register = () => {
  const userType = useParams().userType;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: userType || 'customer',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
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

  const handleUserTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      userType: type,
    }));
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    if (!data.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!data.password || data.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!data.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (data.password !== data.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!data.agreeTerms) newErrors.agreeTerms = 'You must agree to terms and conditions';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/register', {
        ...formData,
        email: formData.email.toLowerCase(),
      });
      toast.success(res.data.message || 'Account created successfully!');
      navigate('/login');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        (error.response?.status === 409
          ? 'This email is already registered. Please log in instead.'
          : 'Registration failed. Please try again.');
      toast.error(message);
      if (error.response?.status === 409) {
        setErrors((prev) => ({
          ...prev,
          email: 'Email already registered. Please log in.',
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-[#080a11]/80 border rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
      errors[field]
        ? 'border-rose-500'
        : 'border-white/10 focus:border-[#ff5400] focus:ring-1 focus:ring-[#ff5400]/50'
    }`;

  const roles = [
    { id: 'customer', label: 'Foodie / Customer', icon: IoPersonOutline },
    { id: 'restaurant', label: 'Culinary Partner', icon: IoRestaurantOutline },
    { id: 'rider', label: 'Fleet Courier', icon: IoBicycleOutline },
  ];

  return (
    <div className="min-h-screen bg-[#080a11] text-gray-100 flex items-center justify-center py-16 px-4 relative overflow-hidden selection:bg-[#ff5400] selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#ff5400]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#e11d48]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="bg-[#131826]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 max-w-xl w-full shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/30 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-3">
            <IoSparklesOutline /> Join The Collective
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            Create Cravings Account
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Access exclusive tasting menus, expedited dispatch, and culinary perks
          </p>
        </div>

        {/* User Type Segmented Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
            Register As:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = formData.userType === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => handleUserTypeSelect(r.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#ff5400] to-[#e11d48] text-white border-transparent shadow-lg shadow-[#ff5400]/25'
                      : 'bg-[#080a11]/60 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Icon className="text-lg mb-1" />
                  <span className="text-[11px] text-center leading-tight">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Marcus Wareing"
                className={inputClass('fullName')}
              />
              {errors.fullName && (
                <span className="text-rose-400 text-xs mt-1 block font-medium">
                  {errors.fullName}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="marcus@cravings.com"
                className={inputClass('email')}
              />
              {errors.email && (
                <span className="text-rose-400 text-xs mt-1 block font-medium">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className={inputClass('phone')}
              />
              {errors.phone && (
                <span className="text-rose-400 text-xs mt-1 block font-medium">{errors.phone}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Min 6 characters"
                className={inputClass('password')}
              />
              {errors.password && (
                <span className="text-rose-400 text-xs mt-1 block font-medium">
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-type your password"
              className={inputClass('confirmPassword')}
            />
            {errors.confirmPassword && (
              <span className="text-rose-400 text-xs mt-1 block font-medium">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-gray-400 hover:text-gray-300">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="w-4 h-4 mt-0.5 rounded bg-[#080a11] border-white/20 text-[#ff5400] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs leading-relaxed">
                I agree to the{' '}
                <Link
                  to="/terms-of-service"
                  className="text-[#ff5400] hover:underline font-semibold"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="text-[#ff5400] hover:underline font-semibold">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.agreeTerms && (
              <span className="text-rose-400 text-xs mt-1 block font-medium">
                {errors.agreeTerms}
              </span>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#ff5400] to-[#e11d48] hover:from-[#e04800] hover:to-[#cc163d] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#ff5400]/25 hover:shadow-[#ff5400]/40 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Already part of Cravings?{' '}
          <Link to="/login" className="text-[#ff5400] font-black hover:underline">
            Sign In Here →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

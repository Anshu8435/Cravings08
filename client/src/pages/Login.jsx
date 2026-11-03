import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoSparklesOutline, IoLockClosedOutline, IoMailOutline } from 'react-icons/io5';
import api from '../config/ApiConfig';
import { useAuth } from '../context/AuthContext';
import ForgotPasswordModal from '../components/commonModals/ForgotPasswordModal';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLogin, setRole } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.email.trim()) newErrors.email = 'Email is required';
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
      toast.success(res.data.message);
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
      <div className="min-h-screen bg-[#080a11] text-gray-100 flex items-center justify-center py-16 px-4 relative overflow-hidden selection:bg-[#ff5400] selection:text-white">
        {/* Cinematic glow circles */}
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-[#ff5400]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-[#e11d48]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="bg-[#131826]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/30 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-3">
              <IoSparklesOutline /> Cravings Portal
            </div>
            <h1 className="text-3xl font-black text-white font-['Space_Grotesk'] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Sign in to manage your culinary reservations and orders
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-[#080a11]/80 border rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                    errors.email
                      ? 'border-rose-500'
                      : 'border-white/10 focus:border-[#ff5400] focus:ring-1 focus:ring-[#ff5400]/50'
                  }`}
                />
                <IoMailOutline className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
              </div>
              {errors.email && (
                <span className="text-rose-400 text-xs mt-1 block font-medium">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your security code"
                  className={`w-full pl-10 pr-11 py-3 bg-[#080a11]/80 border rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                    errors.password
                      ? 'border-rose-500'
                      : 'border-white/10 focus:border-[#ff5400] focus:ring-1 focus:ring-[#ff5400]/50'
                  }`}
                />
                <IoLockClosedOutline className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <span className="text-rose-400 text-xs mt-1 block font-medium">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded bg-[#080a11] border-white/20 text-[#ff5400] focus:ring-0 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordModalOpen(true)}
                className="text-[#ff5400] hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#ff5400] to-[#e11d48] hover:from-[#e04800] hover:to-[#cc163d] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#ff5400]/25 hover:shadow-[#ff5400]/40 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In to Cravings'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#131826] text-gray-500 font-semibold">
                New to Cravings?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-400 text-xs">
            Experience the culinary revolution.{' '}
            <Link to="/register" className="text-[#ff5400] font-black hover:underline">
              Create Account →
            </Link>
          </p>
        </div>
      </div>

      {isForgotPasswordModalOpen && (
        <ForgotPasswordModal
          open={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
        />
      )}
    </>
  );
};

export default Login;

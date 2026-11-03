import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';
import { IoSparklesOutline, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import api from '../config/ApiConfig';

const Feedback = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    category: '',
    rating: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    'Food Quality & Presentation',
    'Delivery Velocity & Packaging',
    'Platform Experience & UI',
    'Concierge Support',
    'Culinary Value & Pricing',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!data.category) newErrors.category = 'Please select a category';
    if (!data.rating) newErrors.rating = 'Please select a rating';
    if (!data.message.trim()) newErrors.message = 'Please share your feedback';

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
      const response = await api.post('/public/feedback', {
        ...formData,
        email: formData.email.toLowerCase(),
        rating: Number(formData.rating),
      });

      toast.success(response.data.message || 'Feedback submitted to Culinary Board!');
      setFormData({
        fullName: '',
        email: '',
        category: '',
        rating: '',
        message: '',
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to submit feedback. Please try again.');
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

  return (
    <div className="min-h-screen bg-[#080a11] text-gray-100 flex items-center justify-center py-16 px-4 relative overflow-hidden selection:bg-[#ff5400] selection:text-white">
      {/* Dynamic ambient blur spots */}
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-[#ff5400]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[450px] h-[450px] bg-[#f59e0b]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="bg-[#131826]/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 max-w-lg w-full border border-white/10 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/30 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-3">
            <IoChatbubbleEllipsesOutline /> Foodie Voice
          </div>
          <h1 className="text-3xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            Share Your Experience
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Help our master chefs and courier fleet continuously elevate standards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. Gordon Ramsay"
              className={inputClass('fullName')}
            />
            {errors.fullName && (
              <p className="text-rose-400 text-xs mt-1 font-medium">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="gordon@example.com"
              className={inputClass('email')}
            />
            {errors.email && (
              <p className="text-rose-400 text-xs mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Feedback Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`${inputClass('category')} appearance-none`}
            >
              <option value="" className="bg-[#0e121d]">
                Select an experience category
              </option>
              {categories.map((category) => (
                <option key={category} value={category} className="bg-[#0e121d]">
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-rose-400 text-xs mt-1 font-medium">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Overall Rating</label>
            <div className="flex gap-3 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                  className={`text-2xl transition-transform hover:scale-125 ${
                    Number(formData.rating) >= star ? 'text-amber-400' : 'text-gray-600'
                  }`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-rose-400 text-xs mt-1 font-medium">{errors.rating}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Your Review & Feedback
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Detail your thoughts on taste, heat, speed, or app design..."
              rows={4}
              className={inputClass('message') + ' resize-none'}
            />
            {errors.message && (
              <p className="text-rose-400 text-xs mt-1 font-medium">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#ff5400] to-[#e11d48] hover:from-[#e04800] hover:to-[#cc163d] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#ff5400]/25 hover:shadow-[#ff5400]/40 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Transmitting Feedback...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;

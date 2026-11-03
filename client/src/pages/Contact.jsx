import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeadset } from 'react-icons/fa';
import { IoSparklesOutline, IoSend } from 'react-icons/io5';
import api from '../config/ApiConfig';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    if (!data.subject.trim()) newErrors.subject = 'Subject is required';
    if (!data.message.trim()) newErrors.message = 'Message is required';
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
      const res = await api.post('/public/contact-us', {
        ...formData,
        email: formData.email.toLowerCase(),
      });
      toast.success(res.data.message || 'Message dispatched to culinary concierge!');
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to dispatch message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-[#080a11]/80 border rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
      errors[field]
        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
        : 'border-white/10 focus:border-[#ff5400] focus:ring-1 focus:ring-[#ff5400]/50'
    }`;

  return (
    <div className="min-h-screen bg-[#080a11] text-gray-100 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#ff5400] selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff5400]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#e11d48]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Concierge Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5400]/15 border border-[#ff5400]/40 text-[#ff5400] text-xs font-black tracking-widest uppercase">
            <FaHeadset /> Culinary Concierge
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            We are here to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5400] via-[#f59e0b] to-[#e11d48]">
              serve your appetite.
            </span>
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed">
            Have questions about a chef reservation, private catering, corporate dining, or courier
            dispatch? Connect directly with our priority support desk.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0e121d] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#ff5400]/10 flex items-center justify-center text-[#ff5400]">
                <FaPhoneAlt />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Priority Hotline
                </span>
                <span className="text-sm font-black text-white">+91 (800) 420-CRAVE</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0e121d] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]">
                <FaEnvelope />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Direct Concierge Email
                </span>
                <span className="text-sm font-black text-white">concierge@cravings.com</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0e121d] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
                <FaMapMarkerAlt />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Global Gastronomy Hub
                </span>
                <span className="text-sm font-black text-white">Cyber City, Gurugram, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: High-End Contact Form */}
        <div className="lg:col-span-7 bg-[#131826]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white font-['Space_Grotesk']">
              Send a Dispatch
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Average response time: &lt; 15 minutes during active kitchen hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Elena Rostova"
                  className={inputClass('fullName')}
                />
                {errors.fullName && (
                  <span className="text-rose-400 text-xs mt-1 block font-medium">
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className={inputClass('email')}
                />
                {errors.email && (
                  <span className="text-rose-400 text-xs mt-1 block font-medium">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className={inputClass('phone')}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Inquiry about catering"
                  className={inputClass('subject')}
                />
                {errors.subject && (
                  <span className="text-rose-400 text-xs mt-1 block font-medium">
                    {errors.subject}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Detail your inquiry or feedback..."
                rows={4}
                className={inputClass('message') + ' resize-none'}
              />
              {errors.message && (
                <span className="text-rose-400 text-xs mt-1 block font-medium">
                  {errors.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#ff5400] to-[#e11d48] hover:from-[#e04800] hover:to-[#cc163d] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#ff5400]/25 hover:shadow-[#ff5400]/40 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Dispatching...</span>
              ) : (
                <>
                  <IoSend className="text-sm" />
                  <span>Transmit Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

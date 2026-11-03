import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaQuestionCircle,
  FaShoppingBag,
  FaCreditCard,
  FaBicycle,
  FaUser,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { IoSparklesOutline, IoHelpBuoyOutline } from 'react-icons/io5';
import api from '../config/ApiConfig';

const HelpCenter = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    issueType: '',
    orderId: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: 'How do I track my active order in real time?',
      answer:
        'Navigate to your Customer Dashboard → Orders tab. Click on your active order to view live GPS radar, courier coordinates, and thermal box temperatures.',
      icon: <FaShoppingBag className="text-[#ff5400] text-lg mr-3 shrink-0" />,
    },
    {
      question: 'What is the refund and satisfaction policy?',
      answer:
        'If a dish arrives cold or damaged, submit a ticket below with your Order ID. Our concierge processes priority refunds within 2–3 business hours.',
      icon: <FaCreditCard className="text-[#ff5400] text-lg mr-3 shrink-0" />,
    },
    {
      question: 'How do temperature lockers maintain food heat?',
      answer:
        'Our couriers utilize active dual-chamber compartments regulated electronically to 65°C for hot meals and -2°C for artisanal desserts.',
      icon: <FaBicycle className="text-[#ff5400] text-lg mr-3 shrink-0" />,
    },
    {
      question: 'How do I change delivery address or contact details?',
      answer:
        'Go to Customer Dashboard → Settings to manage your saved address array and dietary profiles.',
      icon: <FaUser className="text-[#ff5400] text-lg mr-3 shrink-0" />,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.issueType || formData.issueType === 'Select issue type') {
      newErrors.issueType = 'Please select an issue type';
    }
    if (!formData.message.trim()) newErrors.message = 'Please describe the problem in detail';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const formattedMessage = formData.orderId.trim()
        ? `Order ID: ${formData.orderId.trim()}\n\nDescription: ${formData.message.trim()}`
        : formData.message.trim();

      const res = await api.post('/public/contact-us', {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        subject: formData.issueType,
        message: formattedMessage,
      });

      toast.success(res.data.message || 'Support ticket logged with concierge team!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        issueType: '',
        orderId: '',
        message: '',
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-[#080a11]/90 border rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 text-sm ${
      errors[field]
        ? 'border-rose-500'
        : 'border-white/10 focus:border-[#ff5400] focus:ring-1 focus:ring-[#ff5400]/50'
    }`;

  return (
    <div className="min-h-screen bg-[#080a11] text-gray-100 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#ff5400] selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#ff5400]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#e11d48]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main glassmorphism card */}
      <div className="relative z-10 max-w-6xl w-full bg-[#131826]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 md:p-12 text-white">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/30 text-[#ff5400] text-xs font-black tracking-widest uppercase mb-3">
            <IoHelpBuoyOutline /> Support Matrix
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            How Can We Assist You?
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-lg mx-auto">
            Browse verified knowledge solutions or lodge a direct priority ticket with our concierge
            team.
          </p>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: FAQ Accordion */}
          <div className="space-y-6">
            <h6 className="text-xs font-black tracking-widest uppercase text-[#ff5400] border-b border-white/10 pb-3">
              Frequently Answered Inquiries
            </h6>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#182032] border-[#ff5400]/40 shadow-lg'
                        : 'bg-[#0e121d] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none transition-colors"
                      type="button"
                    >
                      <div className="flex items-center pr-2">
                        {faq.icon}
                        <span className="font-bold text-sm text-gray-100 font-['Space_Grotesk']">
                          {faq.question}
                        </span>
                      </div>
                      <div>
                        {isOpen ? (
                          <FaChevronUp className="text-[#ff5400] text-xs" />
                        ) : (
                          <FaChevronDown className="text-gray-500 text-xs" />
                        )}
                      </div>
                    </button>

                    {/* Collapsible Content */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? 'max-h-40 border-t border-white/10' : 'max-h-0'
                      }`}
                    >
                      <div className="p-4 sm:p-5 bg-black/30 text-gray-300 text-xs sm:text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Ticket Submission Form */}
          <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-10">
            <h6 className="text-xs font-black tracking-widest uppercase text-[#f59e0b] border-b border-white/10 pb-3">
              Submit Direct Concierge Ticket
            </h6>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full legal name"
                  className={inputClass('fullName')}
                />
                {errors.fullName && (
                  <span className="text-rose-400 text-xs mt-1 block font-medium">
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
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

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className={inputClass('phone')}
                  />
                  {errors.phone && (
                    <span className="text-rose-400 text-xs mt-1 block font-medium">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <select
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleInputChange}
                    className={`${inputClass('issueType')} appearance-none`}
                  >
                    <option value="" className="bg-[#0e121d]">
                      Select issue category
                    </option>
                    <option value="Active Order Delay" className="bg-[#0e121d]">
                      Active Order Delay
                    </option>
                    <option value="Refund & Billing Request" className="bg-[#0e121d]">
                      Refund & Billing Request
                    </option>
                    <option value="Food Quality & Heat Report" className="bg-[#0e121d]">
                      Food Quality & Heat Report
                    </option>
                    <option value="Account & Profile Assistance" className="bg-[#0e121d]">
                      Account & Profile Assistance
                    </option>
                    <option value="Other Culinary Inquiry" className="bg-[#0e121d]">
                      Other Culinary Inquiry
                    </option>
                  </select>
                  {errors.issueType && (
                    <span className="text-rose-400 text-xs mt-1 block font-medium">
                      {errors.issueType}
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    placeholder="Order ID (Optional)"
                    className={inputClass('orderId')}
                  />
                </div>
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Detail your request or issue with specifics..."
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
                className="w-full py-3.5 bg-gradient-to-r from-[#ff5400] to-[#e11d48] hover:from-[#e04800] hover:to-[#cc163d] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#ff5400]/25 hover:shadow-[#ff5400]/40 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting to Dispatch...' : 'Dispatch Support Ticket'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

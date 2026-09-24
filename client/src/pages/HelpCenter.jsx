import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaQuestionCircle,
  FaShoppingBag,
  FaCreditCard,
  FaBicycle,
  FaUser,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import api from "../config/ApiConfig";

const HelpCenter = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    issueType: "",
    orderId: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "Go to your dashboard → Orders and click on the active order to see live tracking.",
      icon: <FaShoppingBag className="text-orange-500 text-lg mr-3 shrink-0" />,
    },
    {
      question: "How do I get a refund?",
      answer:
        "Submit a ticket below with your Order ID and our team will process it within 2–3 business days.",
      icon: <FaCreditCard className="text-orange-500 text-lg mr-3 shrink-0" />,
    },
    {
      question: "My rider is late. What do I do?",
      answer:
        "You can contact your rider directly via the order page or raise a support ticket.",
      icon: <FaBicycle className="text-orange-500 text-lg mr-3 shrink-0" />,
    },
    {
      question: "How do I update my account info?",
      answer:
        "Navigate to your dashboard → Settings to update your profile details.",
      icon: <FaUser className="text-orange-500 text-lg mr-3 shrink-0" />,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.issueType || formData.issueType === "Select issue type") {
      newErrors.issueType = "Please select an issue type";
    }
    if (!formData.message.trim()) newErrors.message = "Please describe the problem in detail";
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
      // Map form fields to backend expectations
      // Prepend/append the optional Order ID inside the message field
      const formattedMessage = formData.orderId.trim()
        ? `Order ID: ${formData.orderId.trim()}\n\nDescription: ${formData.message.trim()}`
        : formData.message.trim();

      const res = await api.post("/public/contact-us", {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        subject: formData.issueType,
        message: formattedMessage,
      });

      toast.success(res.data.message || "Ticket submitted successfully!");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        issueType: "",
        orderId: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit ticket. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-white/10 border rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/15 transition-all duration-300 text-sm ${
      errors[field] ? "border-red-500 border-2" : "border-white/20"
    }`;

  return (
    <div className="min-h-screen bg-[url('/HelpPage.jpg')] bg-cover bg-center flex items-center justify-center p-6 md:p-16 relative">
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/65 z-0"></div>

      {/* Main glassmorphism card */}
      <div className="relative z-10 max-w-6xl w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 md:p-12 text-white">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-3 text-orange-400">
            <FaQuestionCircle className="animate-pulse" />
            <span>Help Center</span>
          </h2>
          <p className="text-white/80 mt-2 text-sm md:text-base">
            Browse FAQs or submit a support ticket below.
          </p>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT: FAQ Accordion */}
          <div className="space-y-6">
            <h6 className="text-xs font-bold tracking-wider uppercase text-orange-400 border-b border-white/10 pb-2">
              Frequently Asked Questions
            </h6>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className={`border border-white/20 rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300 ${
                      isOpen ? "bg-white/10 shadow-lg" : ""
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 text-left focus:outline-none transition-colors"
                      type="button"
                    >
                      <div className="flex items-center pr-2">
                        {faq.icon}
                        <span className="font-medium text-sm md:text-base text-white/95">
                          {faq.question}
                        </span>
                      </div>
                      <div>
                        {isOpen ? (
                          <FaChevronUp className="text-orange-400 text-sm transition-transform duration-300" />
                        ) : (
                          <FaChevronDown className="text-white/60 text-sm transition-transform duration-300" />
                        )}
                      </div>
                    </button>
                    
                    {/* Collapsible Content */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-40 border-t border-white/10" : "max-h-0"
                      }`}
                    >
                      <div className="p-4 bg-black/25 text-white/85 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Ticket Submission Form */}
          <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-12">
            <h6 className="text-xs font-bold tracking-wider uppercase text-orange-400 border-b border-white/10 pb-2">
              Submit a Support Ticket
            </h6>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={inputClass("fullName")}
                />
                {errors.fullName && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={inputClass("email")}
                />
                {errors.email && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number (e.g. +1 234 567 890)"
                  className={inputClass("phone")}
                />
                {errors.phone && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* Issue Type Select */}
              <div>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  className={`w-full bg-white/10 border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/15 transition-all duration-300 text-sm ${
                    errors.issueType ? "border-red-500 border-2" : "border-white/20"
                  }`}
                >
                  <option value="" className="bg-(--color-secondary) text-(--color-secondary-content)">
                    Select issue type
                  </option>
                  <option value="Accounts & Profile" className="bg-(--color-secondary) text-(--color-secondary-content)">
                    Accounts & Profile
                  </option>
                  <option value="Order Issues" className="bg-(--color-secondary) text-(--color-secondary-content)">
                    Order Issues
                  </option>
                  <option value="Payment & Billing" className="bg-(--color-secondary) text-(--color-secondary-content)">
                    Payment & Billing
                  </option>
                  <option value="Delivery Problem" className="bg-(--color-secondary) text-(--color-secondary-content)">
                    Delivery Problem
                  </option>
                  <option value="Restaurant / Menu" className="bg-(--color-secondary) text-(--color-secondary-content)">
                    Restaurant / Menu
                  </option>
                  <option value="Other" className="bg-(--color-secondary) text-(--color-secondary-content)">
                    Other
                  </option>
                </select>
                {errors.issueType && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.issueType}
                  </span>
                )}
              </div>

              {/* Order ID (Optional) */}
              <div>
                <input
                  type="text"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleInputChange}
                  placeholder="Order ID (e.g. ORD00123) (Optional)"
                  className={inputClass("orderId")}
                />
              </div>

              {/* Description Message */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe the problem in detail..."
                  rows={4}
                  className={`${inputClass("message")} resize-none`}
                />
                {errors.message && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition duration-300 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  "Submit Ticket"
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

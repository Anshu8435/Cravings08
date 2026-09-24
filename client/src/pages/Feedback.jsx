import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import api from "../config/ApiConfig";

const Feedback = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "",
    rating: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    "Food Quality",
    "Delivery Experience",
    "App & Website",
    "Customer Support",
    "Pricing & Value",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
      newErrors.email = "Please enter a valid email";
    }
    if (!data.category) newErrors.category = "Please select a category";
    if (!data.rating) newErrors.rating = "Please select a rating";
    if (!data.message.trim()) newErrors.message = "Please share your feedback";

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
      const response = await api.post("/public/feedback", {
        ...formData,
        email: formData.email.toLowerCase(),
        rating: Number(formData.rating),
      });

      toast.success(response.data.message || "Feedback submitted successfully");
      setFormData({
        fullName: "",
        email: "",
        category: "",
        rating: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to submit feedback. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-md text-sm text-(--color-neutral) bg-white/85 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-(--color-primary) ${
      errors[field]
        ? "border-(--color-error) border-2"
        : "border-white/50 border"
    }`;

  return (
    <div
      className="min-h-[90vh] flex items-start justify-end bg-cover bg-center px-4 py-10 md:px-10"
      style={{ backgroundImage: `url(/FeedbackPage.jpeg)` }}
    >
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl px-6 py-8 max-w-120 w-full border border-white/30">
        <h1 className="text-3xl font-bold text-(--color-primary) mb-3 text-center">
          Share Feedback
        </h1>
        <p className="text-(--color-secondary) text-center mb-7">
          Help us improve your Cravings experience.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-(--color-neutral) mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={inputClass("fullName")}
            />
            {errors.fullName && (
              <p className="text-(--color-error) text-xs mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-(--color-neutral) mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="text-(--color-error) text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-(--color-neutral) mb-2">
              Feedback Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={inputClass("category")}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-(--color-error) text-xs mt-1">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-(--color-neutral) mb-2">
              Overall Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, rating: star }))
                  }
                  className={`text-2xl ${Number(formData.rating) >= star ? "text-yellow-500" : "text-gray-300"}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-(--color-error) text-xs mt-1">
                {errors.rating}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-(--color-neutral) mb-2">
              Your Feedback
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us about your experience..."
              rows={5}
              className={inputClass("message") + " resize-none"}
            />
            {errors.message && (
              <p className="text-(--color-error) text-xs mt-1">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-(--color-primary)/95 text-white font-semibold rounded-2xl hover:bg-(--color-primary) transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;

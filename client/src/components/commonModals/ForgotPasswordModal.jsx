import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuLoaderCircle } from "react-icons/lu";
import { FaEnvelope, FaKey, FaShieldAlt, FaLockOpen } from "react-icons/fa";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";

const ForgotPasswordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleCloseModal = () => {
    onClose();
    setFormData({
      email: "",
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setIsOtpSent(false);
    setIsOtpVerified(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      if (!isOtpSent) {
        const res = await api.post("/auth/send-otp", formData);
        toast.success(res.data.message);
        setIsOtpSent(true);
      }

      if (isOtpSent && !isOtpVerified) {
        const res = await api.post("/auth/verify-otp", formData);
        toast.success(res.data.message);
        setIsOtpVerified(true);
      }
      if (isOtpSent && isOtpVerified) {
        // Check if both passwords match
        if (formData.newPassword !== formData.confirmNewPassword) {
          toast.error("New Password and Confirm Password do not match.");
          return;
        }

        const res = await api.post("/auth/reset-password", formData);

        toast.success(res.data.message);

        handleCloseModal();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during password reset. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <header className="relative bg-gradient-to-r from-(--color-primary) to-orange-400 p-6 text-white text-center">
          <button 
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-transform hover:scale-110 hover:rotate-90 duration-300"
          >
            <IoIosCloseCircleOutline className="text-3xl" />
          </button>
          
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner backdrop-blur-sm">
            <FaLockOpen className="text-3xl text-white drop-shadow-md" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Forgot Password?</h2>
          <p className="text-orange-100 text-sm mt-1 font-medium">
            {!isOtpSent 
              ? "Enter your email to receive a secure OTP." 
              : !isOtpVerified 
                ? "Enter the OTP sent to your email." 
                : "Create a new strong password."}
          </p>
        </header>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5 bg-gray-50 dark:bg-gray-900/50">
          
          {/* Email Step */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-(--color-primary) transition-colors">
              <FaEnvelope />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your Registered Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition-all font-medium text-gray-800 dark:text-gray-100 shadow-sm disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-900"
              disabled={isLoading || isOtpSent}
            />
          </div>

          {/* OTP Step */}
          {isOtpSent && (
            <div className="relative group animate-in slide-in-from-top-4 duration-300">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-(--color-primary) transition-colors">
                <FaShieldAlt />
              </div>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition-all font-medium text-gray-800 dark:text-gray-100 shadow-sm tracking-widest disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-900"
                disabled={isLoading || isOtpVerified}
              />
            </div>
          )}

          {/* New Password Step */}
          {isOtpSent && isOtpVerified && (
            <div className="space-y-5 animate-in slide-in-from-top-4 duration-300">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-(--color-primary) transition-colors">
                  <FaKey />
                </div>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition-all font-medium text-gray-800 dark:text-gray-100 shadow-sm"
                  disabled={isLoading}
                />
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-(--color-primary) transition-colors">
                  <FaShieldAlt />
                </div>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  placeholder="Confirm New Password"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition-all font-medium text-gray-800 dark:text-gray-100 shadow-sm"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <footer className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3 bg-white dark:bg-gray-800 rounded-b-3xl">
          <button
            onClick={handleCloseModal}
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm order-2 sm:order-1"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="w-full sm:w-auto px-8 py-3 sm:py-2.5 bg-gradient-to-r from-(--color-primary) to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none order-1 sm:order-2"
            onClick={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LuLoaderCircle className="animate-spin text-lg" /> Processing...
              </>
            ) : isOtpSent ? (
              isOtpVerified ? (
                "Reset Password"
              ) : (
                "Verify OTP"
              )
            ) : (
              "Send OTP"
            )}
          </button>
        </footer>
        
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

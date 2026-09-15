import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuLoaderCircle } from "react-icons/lu";
import { FaLock, FaKey, FaShieldAlt } from "react-icons/fa";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";

const PasswordChangeModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCloseModal = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    try {
      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.error("New password and confirm password do not match.");
        setIsLoading(false);
        return;
      }
      const res = await api.patch("/common/change-password", formData);
      toast.success("Password changed successfully!");
      handleCloseModal();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during password change. Please try again.",
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
            <FaShieldAlt className="text-3xl text-white drop-shadow-md" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Change Password</h2>
          <p className="text-orange-100 text-sm mt-1 font-medium">Keep your account secure by updating your password.</p>
        </header>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5 bg-gray-50 dark:bg-gray-900/50">
          
          {/* Current Password */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-(--color-primary) transition-colors">
              <FaLock />
            </div>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              placeholder="Current Password"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none transition-all font-medium text-gray-800 dark:text-gray-100 shadow-sm"
              disabled={isLoading}
            />
          </div>

          {/* New Password */}
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

          {/* Confirm New Password */}
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

        {/* Footer Actions */}
        <footer className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3 bg-white dark:bg-gray-800 rounded-b-3xl">
          <button
            onClick={handleCloseModal}
            className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm w-full sm:w-auto"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2.5 bg-gradient-to-r from-(--color-primary) to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none w-full sm:w-auto"
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LuLoaderCircle className="animate-spin text-lg" /> Changing...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </footer>
        
      </div>
    </div>
  );
};

export default PasswordChangeModal;

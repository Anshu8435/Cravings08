import React, { useState } from "react";
import { MdEdit, MdOutlineLockReset, MdOutlineAddAPhoto } from "react-icons/md";
import { FaUser, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import PasswordChangeModal from "../commonModals/PasswordChangeModal";
import runningLoader from "../../assets/runningLoader.gif";

const RiderSetting = () => {
  const { user, setUser } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("email", formData.email.toLowerCase());
      payload.append("phone", formData.phone);
      if (profilePic) payload.append("displayPic", profilePic);

      const response = await api.put(`/common/edit-profile`, payload);

      setUser(response.data.data);
      sessionStorage.setItem("cravingUser", JSON.stringify(response.data.data));

      setEditingProfile(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelProfile = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setProfilePicPreview(null);
    setProfilePic(null);
    setEditingProfile(false);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
      setProfilePic(file);
    }
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto py-4 px-4 sm:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
          
          {/* Banner Image */}
          <div className="h-32 sm:h-48 w-full bg-linear-to-r from-orange-400 via-rose-500 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
            
            {/* Top Right Actions */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col sm:flex-row gap-2">
              {!editingProfile ? (
                <>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="flex items-center gap-1.5 sm:gap-2 bg-white/90 hover:bg-white text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all"
                  >
                    <MdEdit className="text-base sm:text-lg text-(--color-primary)" /> Edit
                  </button>
                  <button
                    onClick={() => setIsPasswordChangeModalOpen(true)}
                    className="flex items-center gap-1.5 sm:gap-2 bg-white/90 hover:bg-white text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all"
                  >
                    <MdOutlineLockReset className="text-base sm:text-lg text-(--color-primary)" /> <span className="hidden sm:inline">Change Password</span><span className="sm:hidden">Password</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancelProfile}
                    className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center justify-center gap-2 bg-white text-(--color-primary) px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70 w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Header section (Avatar overlapping banner) */}
          <div className="px-6 sm:px-12 relative pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-end -mt-12 sm:-mt-16 relative z-10 mb-4">
              
              {/* Avatar */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white dark:bg-gray-800 p-1.5 shadow-2xl shrink-0 group">
                <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
                  {profilePicPreview || user?.photo?.url ? (
                    <img src={profilePicPreview || user?.photo?.url} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaUser size={40} className="opacity-30" />
                    </div>
                  )}
                  {editingProfile && (
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white backdrop-blur-sm rounded-full">
                      <MdOutlineAddAPhoto className="text-3xl mb-1" />
                      <span className="text-sm font-bold">Update</span>
                      <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Title / Intro */}
              <div className="flex-1 pb-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {user?.fullName || "Rider Profile"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium text-sm">Manage your personal information and settings</p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-4 sm:p-8 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-(--color-primary) flex items-center justify-center">
                  <FaUser size={14} />
                </span>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${editingProfile ? "text-(--color-primary)" : "text-gray-400"}`}>
                    <FaUser />
                  </div>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleProfileChange} 
                    disabled={!editingProfile}
                    placeholder="Full Name" 
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all font-bold shadow-sm border
                      ${editingProfile 
                        ? "bg-white dark:bg-gray-800 border-orange-200 dark:border-gray-600 focus:ring-2 focus:ring-(--color-primary) text-gray-800 dark:text-gray-100" 
                        : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      }
                    `} 
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope />
                  </div>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleProfileChange} 
                    disabled 
                    placeholder="Email Address" 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent rounded-xl outline-none font-bold text-gray-500 dark:text-gray-400 shadow-sm cursor-not-allowed" 
                  />
                </div>

                {/* Phone */}
                <div className="relative md:col-span-2">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${editingProfile ? "text-(--color-primary)" : "text-gray-400"}`}>
                    <FaPhoneAlt />
                  </div>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleProfileChange} 
                    disabled={!editingProfile}
                    placeholder="Phone Number" 
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all font-bold shadow-sm border
                      ${editingProfile 
                        ? "bg-white dark:bg-gray-800 border-orange-200 dark:border-gray-600 focus:ring-2 focus:ring-(--color-primary) text-gray-800 dark:text-gray-100" 
                        : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      }
                    `} 
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile Actions */}
            {editingProfile && (
              <div className="sm:hidden pt-4">
                <button 
                  onClick={handleSaveProfile} 
                  disabled={isLoading} 
                  className="w-full bg-linear-to-r from-(--color-primary) to-orange-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:transform-none flex justify-center items-center gap-2"
                >
                  {isLoading ? <img src={runningLoader} alt="Loading..." className="w-5 h-5 object-contain" /> : null}
                  {isLoading ? "Saving Profile..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isPasswordChangeModalOpen && (
        <PasswordChangeModal
          open={isPasswordChangeModalOpen}
          onClose={() => setIsPasswordChangeModalOpen(false)}
        />
      )}
    </>
  );
};

export default RiderSetting;

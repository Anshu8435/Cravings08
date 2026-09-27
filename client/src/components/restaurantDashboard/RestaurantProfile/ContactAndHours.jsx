import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/ApiConfig";
import runningLoader from "../../../assets/runningLoader.gif";

const ContactAndHours = ({ initialData, onSuccess, activeRestaurantId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    contactEmail: initialData?.contactDetails?.email || "",
    contactPhone: initialData?.contactDetails?.phone || "",
    openingTime: initialData?.servingHours?.openingTime || "",
    closingTime: initialData?.servingHours?.closingTime || "",
    facebookUrl: initialData?.socialMediaLinks?.find(l => l.platform === 'facebook')?.url || "",
    instagramUrl: initialData?.socialMediaLinks?.find(l => l.platform === 'instagram')?.url || "",
    twitterUrl: initialData?.socialMediaLinks?.find(l => l.platform === 'twitter')?.url || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setFormData({
      contactEmail: initialData?.contactDetails?.email || "",
      contactPhone: initialData?.contactDetails?.phone || "",
      openingTime: initialData?.servingHours?.openingTime || "",
      closingTime: initialData?.servingHours?.closingTime || "",
      facebookUrl: initialData?.socialMediaLinks?.find(l => l.platform === 'facebook')?.url || "",
      instagramUrl: initialData?.socialMediaLinks?.find(l => l.platform === 'instagram')?.url || "",
      twitterUrl: initialData?.socialMediaLinks?.find(l => l.platform === 'twitter')?.url || "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = new FormData();
      if (activeRestaurantId) {
        payload.append("restaurantId", activeRestaurantId);
      }
      payload.append("contactDetails.email", formData.contactEmail);
      payload.append("contactDetails.phone", formData.contactPhone);
      payload.append("servingHours.openingTime", formData.openingTime);
      payload.append("servingHours.closingTime", formData.closingTime);

      const socialLinks = [];
      if (formData.facebookUrl) socialLinks.push({ platform: "facebook", url: formData.facebookUrl });
      if (formData.instagramUrl) socialLinks.push({ platform: "instagram", url: formData.instagramUrl });
      if (formData.twitterUrl) socialLinks.push({ platform: "twitter", url: formData.twitterUrl });
      
      if (socialLinks.length > 0) {
        payload.append("socialMediaLinks", JSON.stringify(socialLinks));
      } else {
        payload.append("socialMediaLinks", "[]"); // Clear them if empty
      }

      const response = await api.post("/restaurant/update-profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Contact & Hours updated successfully!");
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update contact info");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-(--color-base-100) p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300 transform">
      <div className="flex justify-between items-center mb-6 pb-2">
        <h3 className="text-xl font-bold text-(--color-base-content) border-b-2 border-(--color-primary) pb-2 inline-block">Contact & Hours</h3>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-(--color-primary) text-(--color-primary-content) px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Edit Profile
          </button>
        )}
      </div>

      <fieldset disabled={!isEditing} className={!isEditing ? "view-only-mode" : ""}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Contact Email</label>
            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="px-3 py-2 border rounded" />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Contact Phone</label>
            <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required className="px-3 py-2 border rounded" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Opening Time (HH:MM)</label>
            <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} required className="px-3 py-2 border rounded" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Closing Time (HH:MM)</label>
            <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} required className="px-3 py-2 border rounded" />
          </div>
        </div>

        <h4 className="text-md font-bold mt-6 mb-4 text-(--color-base-content)">Social Media Links (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Facebook URL</label>
            <input type="url" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." className="px-3 py-2 border rounded" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Instagram URL</label>
            <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." className="px-3 py-2 border rounded" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Twitter URL</label>
            <input type="url" name="twitterUrl" value={formData.twitterUrl} onChange={handleChange} placeholder="https://twitter.com/..." className="px-3 py-2 border rounded" />
          </div>
        </div>
      </fieldset>

      {isEditing && (
        <div className="flex justify-end gap-3 mt-6 pt-4">
          <button 
            type="button" 
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded font-medium disabled:bg-opacity-70 flex items-center gap-2">
            {isLoading ? (
              <img src={runningLoader} alt="Loading..." className="w-5 h-5 object-contain" />
            ) : null}
            Save Contact & Hours
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactAndHours;

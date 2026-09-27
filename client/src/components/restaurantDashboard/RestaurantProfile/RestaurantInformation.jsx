import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../../config/ApiConfig";
import runningLoader from "../../../assets/runningLoader.gif";
import { COUNTRY_OPTIONS } from "../../../config/countryOptions";

const RestaurantInformation = ({ initialData, onSuccess, isProfileCreated, activeRestaurantId }) => {
  // If profile is not created yet, default to editing mode.
  const [isEditing, setIsEditing] = useState(!isProfileCreated);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    restaurantName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    description: "",
    restaurantType: "both",
    cuisineTypes: "",
    lat: "",
    lon: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        restaurantName: initialData.restaurantName || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pinCode: initialData.pinCode || "",
        country: initialData.country || "",
        description: initialData.description || "",
        restaurantType: initialData.restaurantType || "both",
        cuisineTypes: initialData.cuisineTypes?.join(", ") || "",
        lat: initialData.geoLocation?.lat || "",
        lon: initialData.geoLocation?.lon || "",
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [initialData, isProfileCreated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData({
        restaurantName: initialData.restaurantName || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pinCode: initialData.pinCode || "",
        country: initialData.country || "",
        description: initialData.description || "",
        restaurantType: initialData.restaurantType || "both",
        cuisineTypes: initialData.cuisineTypes?.join(", ") || "",
        lat: initialData.geoLocation?.lat || "",
        lon: initialData.geoLocation?.lon || "",
      });
      setIsEditing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = new FormData();
      if (activeRestaurantId) {
        payload.append("restaurantId", activeRestaurantId);
      }
      
      payload.append("restaurantName", formData.restaurantName);
      payload.append("address", formData.address);
      payload.append("city", formData.city);
      payload.append("state", formData.state);
      payload.append("pinCode", formData.pinCode);
      payload.append("country", formData.country);
      payload.append("description", formData.description);
      payload.append("restaurantType", formData.restaurantType);
      
      const cuisines = formData.cuisineTypes.split(",").map(c => c.trim()).filter(c => c);
      cuisines.forEach((c) => payload.append("cuisineTypes", c));
      
      payload.append("geoLocation.lat", formData.lat);
      payload.append("geoLocation.lon", formData.lon);

      const response = await api.post("/restaurant/update-profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Basic Details updated successfully!");
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-(--color-base-100) p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300 transform">
      <div className="flex justify-between items-center mb-6 pb-2">
        <h3 className="text-xl font-bold text-(--color-base-content) border-b-2 border-(--color-primary) pb-2 inline-block">Basic Details & Location</h3>
        {!isEditing && isProfileCreated && (
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium">Restaurant Name</label>
            <input type="text" name="restaurantName" value={formData.restaurantName} onChange={handleChange} required className="px-3 py-1.5 border rounded" />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Restaurant Type</label>
            <select name="restaurantType" value={formData.restaurantType} onChange={handleChange} className="px-3 py-1.5 border rounded bg-white">
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
              <option value="jain">Jain</option>
              <option value="vegan">Vegan</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Cuisine</label>
            <input type="text" name="cuisineTypes" value={formData.cuisineTypes} onChange={handleChange} placeholder="e.g. Italian" required className="px-3 py-1.5 border rounded" />
          </div>
          
          <div className="flex flex-col gap-1 col-span-full">
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="px-3 py-1.5 border rounded" rows="2"></textarea>
          </div>

          <div className="flex flex-col gap-1 col-span-full">
            <label className="text-sm font-medium">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="px-3 py-1.5 border rounded" />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required className="px-3 py-1.5 border rounded" />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required className="px-3 py-1.5 border rounded" />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Pin Code</label>
            <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} required className="px-3 py-1.5 border rounded" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Country</label>
            <select name="country" value={formData.country} onChange={handleChange} required className="px-3 py-1.5 border rounded bg-white">
              <option value="">Select Country</option>
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium">Latitude</label>
            <input type="text" name="lat" value={formData.lat} onChange={handleChange} className="px-3 py-1.5 border rounded" />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium">Longitude</label>
            <input type="text" name="lon" value={formData.lon} onChange={handleChange} className="px-3 py-1.5 border rounded" />
          </div>
        </div>
      </fieldset>

      {isEditing && (
        <div className="flex justify-end gap-3 mt-6 pt-4">
          {isProfileCreated && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          )}
          <button type="submit" disabled={isLoading} className="bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded font-medium disabled:bg-opacity-70 flex items-center gap-2">
            {isLoading ? (
              <img src={runningLoader} alt="Loading..." className="w-5 h-5 object-contain" />
            ) : null}
            {isProfileCreated ? "Save Changes" : "Create Profile"}
          </button>
        </div>
      )}
    </form>
  );
};

export default RestaurantInformation;

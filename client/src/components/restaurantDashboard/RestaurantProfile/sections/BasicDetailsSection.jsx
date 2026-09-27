import React from "react";
import { COUNTRY_OPTIONS } from "../../../../config/countryOptions";

const BasicDetailsSection = ({ formData, handleChange, handleGetLocation, isGettingLocation }) => {
  return (
    <div className="bg-(--color-base-100) p-4 sm:p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300 transform">
      <h3 className="text-lg sm:text-xl font-bold text-(--color-base-content) border-b-2 border-(--color-primary) pb-2 inline-block mb-4 sm:mb-6">Basic Details & Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Restaurant Name</label>
          <input type="text" name="restaurantName" value={formData.restaurantName} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Restaurant Type</label>
          <select name="restaurantType" value={formData.restaurantType} onChange={handleChange} className="px-3 py-2 border rounded bg-white focus:ring-2 focus:ring-(--color-primary) outline-none transition-all">
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
            <option value="jain">Jain</option>
            <option value="vegan">Vegan</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 col-span-full">
          <label className="text-sm font-medium">Cuisine Types (Comma Separated)</label>
          <input type="text" name="cuisineTypes" value={formData.cuisineTypes} onChange={handleChange} placeholder="e.g. Italian, Chinese" required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1 col-span-full">
          <label className="text-sm font-medium">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" rows="3"></textarea>
        </div>
        <div className="flex flex-col gap-1 col-span-full md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Address</label>
            <button
              type="button"
              onClick={handleGetLocation}
              className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={isGettingLocation}
            >
              {isGettingLocation ? "Getting Current Location..." : "Get Current Location"}
            </button>
          </div>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
          {formData.lat && formData.lon && (
            <p className="text-xs text-gray-500 mt-1">
              Selected Coordinates: {formData.lat}, {formData.lon}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">State</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Pin Code</label>
          <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Country</label>
          <select name="country" value={formData.country} onChange={handleChange} required className="px-3 py-2 border rounded bg-white focus:ring-2 focus:ring-(--color-primary) outline-none transition-all">
            <option value="">Select Country</option>
            {COUNTRY_OPTIONS.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsSection;

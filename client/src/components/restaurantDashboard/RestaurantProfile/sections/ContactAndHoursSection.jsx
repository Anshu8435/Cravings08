import React from "react";

const ContactAndHoursSection = ({ formData, handleChange }) => {
  return (
    <div className="bg-(--color-base-100) p-4 sm:p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300 transform">
      <h3 className="text-lg sm:text-xl font-bold text-(--color-base-content) border-b-2 border-(--color-primary) pb-2 inline-block mb-4 sm:mb-6">Contact & Operating Hours</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Contact Email</label>
          <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Contact Phone</label>
          <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Opening Time (HH:MM)</label>
          <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Closing Time (HH:MM)</label>
          <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
      </div>

      <h4 className="text-md font-bold mt-6 mb-4 text-(--color-base-content)">Social Media Links (Optional)</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Facebook URL</label>
          <input type="url" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Instagram URL</label>
          <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Twitter URL</label>
          <input type="url" name="twitterUrl" value={formData.twitterUrl} onChange={handleChange} placeholder="https://twitter.com/..." className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
      </div>
    </div>
  );
};

export default ContactAndHoursSection;

import React from "react";

const DocumentsSection = ({ formData, handleChange, partnerOptions, companyOptions }) => {
  return (
    <div className="bg-(--color-base-100) p-4 sm:p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300 transform">
      <h3 className="text-lg sm:text-xl font-bold text-(--color-base-content) border-b-2 border-(--color-primary) pb-2 inline-block mb-6">Documents & Legal</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Legal Name</label>
          <select
            name="legalName"
            value={formData.legalName}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all bg-white"
          >
            <option value="" disabled>Select a company...</option>
            {partnerOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Company Type</label>
          <select
            name="companyType"
            value={formData.companyType}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all bg-white"
          >
            <option value="" disabled>Select a company type...</option>
            {companyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">GST Certificate (Reg No.)</label>
          <input type="text" name="gstCertificate" value={formData.gstCertificate} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">FSSAI Certificate No.</label>
          <input type="text" name="fssaiCertificate" value={formData.fssaiCertificate} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">PAN Card No.</label>
          <input type="text" name="panCard" value={formData.panCard} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
      </div>
    </div>
  );
};

export default DocumentsSection;

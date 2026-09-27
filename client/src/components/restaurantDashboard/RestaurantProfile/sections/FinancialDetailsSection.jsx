import React from "react";

const FinancialDetailsSection = ({ formData, handleChange }) => {
  return (
    <div className="bg-(--color-base-100) p-4 sm:p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300 transform">
      <h3 className="text-lg sm:text-xl font-bold text-(--color-base-content) border-b-2 border-(--color-primary) pb-2 inline-block mb-4 sm:mb-6">Financial Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Bank Name</label>
          <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Account Number</label>
          <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">IFSC Code</label>
          <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} required className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all" />
        </div>
      </div>
    </div>
  );
};

export default FinancialDetailsSection;

import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/ApiConfig";
import runningLoader from "../../../assets/runningLoader.gif";

const FinancialDetails = ({ initialData, onSuccess, activeRestaurantId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    bankName: initialData?.financialDetails?.bankName || "",
    accountNumber: initialData?.financialDetails?.accountNumber || "",
    ifscCode: initialData?.financialDetails?.ifscCode || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setFormData({
      bankName: initialData?.financialDetails?.bankName || "",
      accountNumber: initialData?.financialDetails?.accountNumber || "",
      ifscCode: initialData?.financialDetails?.ifscCode || "",
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
      payload.append("financialDetails.bankName", formData.bankName);
      payload.append("financialDetails.accountNumber", formData.accountNumber);
      payload.append("financialDetails.ifscCode", formData.ifscCode);

      const response = await api.post("/restaurant/update-profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Financial Details updated successfully!");
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update financial details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-(--color-base-100) p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300 transform">
      <div className="flex justify-between items-center mb-6 pb-2">
        <h3 className="text-xl font-bold text-(--color-base-content) border-b-2 border-(--color-primary) pb-2 inline-block">Financial Details</h3>
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
            <label className="text-sm font-medium">Bank Name</label>
            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} required className="px-3 py-2 border rounded" />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Account Number</label>
            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required className="px-3 py-2 border rounded" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">IFSC Code</label>
            <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} required className="px-3 py-2 border rounded" />
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
            Save Financials
          </button>
        </div>
      )}
    </form>
  );
};

export default FinancialDetails;

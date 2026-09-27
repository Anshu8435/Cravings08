import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/ApiConfig";
import runningLoader from "../../../assets/runningLoader.gif";

const RestaurantDocuments = ({ initialData, onSuccess, activeRestaurantId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const partnerOptions = [
    { value: "zomato", label: "Zomato" },
    { value: "swiggy", label: "Swiggy" },
    { value: "uberEats", label: "Uber Eats" },
    { value: "foodpanda", label: "Foodpanda" },
    { value: "doorDash", label: "DoorDash" },
    { value: "grubhub", label: "Grubhub" },
    { value: "deliveroo", label: "Deliveroo" },
    { value: "postmates", label: "Postmates" },
    { value: "seamless", label: "Seamless" },
    { value: "goPuff", label: "GoPuff" },
    { value: "instacart", label: "Instacart" },
    { value: "eatStreet", label: "EatStreet" },
    { value: "caviar", label: "Caviar" },
    { value: "chowNow", label: "ChowNow" },
    { value: "waitr", label: "Waitr" },
    { value: "justEat", label: "Just Eat" },
    { value: "deliveryHero", label: "Delivery Hero" },
    { value: "glovo", label: "Glovo" },
    { value: "rappi", label: "Rappi" },
    { value: "talabat", label: "Talabat" },
    { value: "grabFood", label: "GrabFood" },
    { value: "goFood", label: "GoFood" },
    { value: "menulog", label: "Menulog" },
    { value: "skipTheDishes", label: "SkipTheDishes" },
  ];

  const companyOptions = [
    { value: "soleProprietorship", label: "Sole Proprietorship" },
    { value: "partnership", label: "Partnership" },
    { value: "limitedLiabilityPartnership", label: "Limited Liability Partnership (LLP)" },
    { value: "privateLimitedCompany", label: "Private Limited Company (Pvt Ltd)" },
    { value: "publicLimitedCompany", label: "Public Limited Company" },
    { value: "onePersonCompany", label: "One Person Company (OPC)" },
    { value: "jointVenture", label: "Joint Venture" },
    { value: "nonGovernmentalOrganization", label: "Non-Governmental Organization (NGO)" },
    { value: "trust", label: "Trust" },
    { value: "society", label: "Society" },
    { value: "section8Company", label: "Section 8 Company" },
    { value: "hinduUndividedFamily", label: "Hindu Undivided Family (HUF)" },
    { value: "cooperativeSociety", label: "Co-operative Society" },
    { value: "branchOffice", label: "Branch Office" },
    { value: "liaisonOffice", label: "Liaison Office" },
    { value: "projectOffice", label: "Project Office" },
    { value: "subsidiaryCompany", label: "Subsidiary Company" },
    { value: "holdingCompany", label: "Holding Company" },
    { value: "statutoryCorporation", label: "Statutory Corporation" },
    { value: "unlimitedCompany", label: "Unlimited Company" },
    { value: "foreignCompany", label: "Foreign Company" },
    { value: "governmentCompany", label: "Government Company" },
    { value: "associateCompany", label: "Associate Company" },
    { value: "producerCompany", label: "Producer Company" },
    { value: "nidhiCompany", label: "Nidhi Company" }
  ];

  const [formData, setFormData] = useState({
    legalName: initialData?.documents?.legalName || "",
    companyType: initialData?.documents?.companyType || "",
    gstCertificate: initialData?.documents?.gstCertificate || "",
    fssaiCertificate: initialData?.documents?.fssaiCertificate || "",
    panCard: initialData?.documents?.panCard || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setFormData({
      legalName: initialData?.documents?.legalName || "",
      companyType: initialData?.documents?.companyType || "",
      gstCertificate: initialData?.documents?.gstCertificate || "",
      fssaiCertificate: initialData?.documents?.fssaiCertificate || "",
      panCard: initialData?.documents?.panCard || "",
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
      payload.append("documents.legalName", formData.legalName);
      payload.append("documents.companyType", formData.companyType);
      payload.append("documents.gstCertificate", formData.gstCertificate);
      payload.append("documents.fssaiCertificate", formData.fssaiCertificate);
      payload.append("documents.panCard", formData.panCard);

      const response = await api.post("/restaurant/update-profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Documents updated successfully!");
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update documents");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-(--color-base-100) p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300 transform">
      <div className="flex justify-between items-center mb-6 pb-2">
        <h3 className="text-xl font-bold text-(--color-base-content) border-b-2 border-(--color-primary) pb-2 inline-block">Documents & Legal</h3>
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
            <label className="text-sm font-medium">Legal Name</label>
            <select
              name="legalName"
              value={formData.legalName}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded bg-white disabled:bg-gray-100 disabled:text-gray-500"
              disabled={!isEditing}
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
              className="px-3 py-2 border rounded bg-white disabled:bg-gray-100 disabled:text-gray-500"
              disabled={!isEditing}
            >
              <option value="" disabled>Select a company type...</option>
              {companyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">GST Certificate (Reg No.)</label>
            <input type="text" name="gstCertificate" value={formData.gstCertificate} onChange={handleChange} required className="px-3 py-2 border rounded" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">FSSAI Certificate No.</label>
            <input type="text" name="fssaiCertificate" value={formData.fssaiCertificate} onChange={handleChange} required className="px-3 py-2 border rounded" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">PAN Card No.</label>
            <input type="text" name="panCard" value={formData.panCard} onChange={handleChange} required className="px-3 py-2 border rounded" />
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
            Save Documents
          </button>
        </div>
      )}
    </form>
  );
};

export default RestaurantDocuments;

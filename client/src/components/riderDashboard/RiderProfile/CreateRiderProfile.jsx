import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineDeliveryDining } from "react-icons/md";
import api from "../../../config/ApiConfig";
import runningLoader from "../../../assets/runningLoader.gif";
import { COUNTRY_OPTIONS } from "../../../config/countryOptions";

const CreateRiderProfile = ({ onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleType: "bike",
    vehicleNumber: "",
    vehicleModel: "",
    vehicleColor: "",
    drivingLicense: "",
    vehicleRegistrationCertificate: "",
    insuranceCertificate: "",
    aadharCard: "",
    panCard: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const payload = {
        vehicleDetails: {
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          vehicleModel: formData.vehicleModel,
          vehicleColor: formData.vehicleColor,
        },
        documents: {
          drivingLicense: formData.drivingLicense,
          vehicleRegistrationCertificate:
            formData.vehicleRegistrationCertificate,
          insuranceCertificate: formData.insuranceCertificate,
          aadharCard: formData.aadharCard,
          panCard: formData.panCard,
        },
        currentAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          country: formData.country,
        },
        financialDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
        },
      };

      const response = await api.post("/rider/update-profile", payload);

      toast.success(
        response.data.message || "Rider Profile Created Successfully!",
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-(--color-primary) to-orange-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <MdOutlineDeliveryDining /> Let's Get Started!
          </h2>
          <p className="text-orange-100 max-w-2xl">
            Welcome to Cravings Rider App! To start delivering, please complete
            your profile below.
          </p>
        </div>
      </div>

      {/* SECTION 1: Vehicle Details */}
      <div className="bg-(--color-base-100) p-4 sm:p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg sm:text-xl font-bold border-b-2 border-(--color-primary) pb-2 inline-block mb-4 sm:mb-6">
          Vehicle Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Vehicle Type</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            >
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
              <option value="bicycle">Bicycle</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Vehicle Number</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Vehicle Model</label>
            <input
              type="text"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Vehicle Color</label>
            <input
              type="text"
              name="vehicleColor"
              value={formData.vehicleColor}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Documents */}
      <div className="bg-(--color-base-100) p-4 sm:p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg sm:text-xl font-bold border-b-2 border-(--color-primary) pb-2 inline-block mb-4 sm:mb-6">
          Documents (ID/No.)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Driving License No.</label>
            <input
              type="text"
              name="drivingLicense"
              value={formData.drivingLicense}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Aadhar Card No.</label>
            <input
              type="text"
              name="aadharCard"
              value={formData.aadharCard}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">PAN Card No.</label>
            <input
              type="text"
              name="panCard"
              value={formData.panCard}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Vehicle RC No.</label>
            <input
              type="text"
              name="vehicleRegistrationCertificate"
              value={formData.vehicleRegistrationCertificate}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium">Insurance Policy No.</label>
            <input
              type="text"
              name="insuranceCertificate"
              value={formData.insuranceCertificate}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Current Address */}
      <div className="bg-(--color-base-100) p-4 sm:p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg sm:text-xl font-bold border-b-2 border-(--color-primary) pb-2 inline-block mb-4 sm:mb-6">
          Current Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium">Address Line</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Pin Code</label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded bg-white focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            >
              <option value="">Select Country</option>
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 4: Financial Details */}
      <div className="bg-(--color-base-100) p-4 sm:p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg sm:text-xl font-bold border-b-2 border-(--color-primary) pb-2 inline-block mb-4 sm:mb-6">
          Financial Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">IFSC Code</label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="bg-gray-200 text-gray-700 w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all text-center"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-(--color-primary) text-(--color-primary-content) w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-lg disabled:bg-opacity-70 flex items-center justify-center gap-3 shadow-lg hover:shadow-orange-500/40 hover:bg-orange-700 transition-all"
        >
          {isLoading ? (
            <>
              <img
                src={runningLoader}
                alt="Loading..."
                className="w-6 h-6 object-contain"
              />
              Adding...
            </>
          ) : (
            "Create Profile"
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateRiderProfile;

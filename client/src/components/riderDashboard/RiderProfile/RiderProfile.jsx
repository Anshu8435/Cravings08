import React, { useState, useEffect } from "react";
import { MdOutlineDeliveryDining, MdAddCircleOutline } from "react-icons/md";
import api from "../../../config/ApiConfig";
import CreateRiderProfile from "./CreateRiderProfile";

// Simple display components for the tabs
const VehicleDetails = ({ initialData }) => (
  <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
    <h3 className="font-bold text-lg border-b pb-2 mb-4">Vehicle Details</h3>
    <div className="grid grid-cols-2 gap-4">
      <p>
        <strong>Type:</strong> {initialData?.vehicleDetails?.vehicleType}
      </p>
      <p>
        <strong>Model:</strong> {initialData?.vehicleDetails?.vehicleModel}
      </p>
      <p>
        <strong>Number:</strong> {initialData?.vehicleDetails?.vehicleNumber}
      </p>
      <p>
        <strong>Color:</strong> {initialData?.vehicleDetails?.vehicleColor}
      </p>
    </div>
  </div>
);

const AddressDetails = ({ initialData }) => (
  <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
    <h3 className="font-bold text-lg border-b pb-2 mb-4">Current Address</h3>
    <div className="grid grid-cols-2 gap-4">
      <p>
        <strong>Address:</strong> {initialData?.currentAddress?.address}
      </p>
      <p>
        <strong>City:</strong> {initialData?.currentAddress?.city}
      </p>
      <p>
        <strong>State:</strong> {initialData?.currentAddress?.state}
      </p>
      <p>
        <strong>Pin Code:</strong> {initialData?.currentAddress?.pinCode}
      </p>
      <p>
        <strong>Country:</strong> {initialData?.currentAddress?.country}
      </p>
    </div>
  </div>
);

const RiderDocuments = ({ initialData }) => (
  <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
    <h3 className="font-bold text-lg border-b pb-2 mb-4">Documents</h3>
    <div className="grid grid-cols-2 gap-4">
      <p>
        <strong>Driving License:</strong>{" "}
        {initialData?.documents?.drivingLicense}
      </p>
      <p>
        <strong>Aadhar Card:</strong> {initialData?.documents?.aadharCard}
      </p>
      <p>
        <strong>PAN Card:</strong> {initialData?.documents?.panCard}
      </p>
      <p>
        <strong>Vehicle RC:</strong>{" "}
        {initialData?.documents?.vehicleRegistrationCertificate}
      </p>
      <p>
        <strong>Insurance:</strong>{" "}
        {initialData?.documents?.insuranceCertificate}
      </p>
    </div>
  </div>
);

const FinancialDetails = ({ initialData }) => (
  <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
    <h3 className="font-bold text-lg border-b pb-2 mb-4">Financial Details</h3>
    <div className="grid grid-cols-2 gap-4">
      <p>
        <strong>Bank Name:</strong> {initialData?.financialDetails?.bankName}
      </p>
      <p>
        <strong>Account Number:</strong>{" "}
        {initialData?.financialDetails?.accountNumber}
      </p>
      <p>
        <strong>IFSC Code:</strong> {initialData?.financialDetails?.ifscCode}
      </p>
    </div>
  </div>
);

const RiderProfileContainer = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState("vehicle");

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/rider/get-profile");
      if (response.data?.data) {
        setProfileData(response.data.data);
        setIsProfileCreated(true);
      } else {
        setIsProfileCreated(false);
      }
    } catch (error) {
      console.error("Error fetching rider profile:", error);
      setIsProfileCreated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 font-semibold">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {isProfileCreated ? (
        <>
          <div className="flex gap-4 border-b border-(--color-base-300) pb-2 overflow-x-auto whitespace-nowrap">
            <button
              className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === "vehicle" ? "border-(--color-primary) text-(--color-primary)" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("vehicle")}
            >
              Vehicle Details
            </button>
            <button
              className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === "documents" ? "border-(--color-primary) text-(--color-primary)" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("documents")}
            >
              Documents
            </button>
            <button
              className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === "address" ? "border-(--color-primary) text-(--color-primary)" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("address")}
            >
              Address
            </button>
            <button
              className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === "financial" ? "border-(--color-primary) text-(--color-primary)" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("financial")}
            >
              Financial Details
            </button>
          </div>

          <div className="animate-fade-in mt-4">
            {activeTab === "vehicle" && (
              <VehicleDetails initialData={profileData} />
            )}
            {activeTab === "documents" && (
              <RiderDocuments initialData={profileData} />
            )}
            {activeTab === "address" && (
              <AddressDetails initialData={profileData} />
            )}
            {activeTab === "financial" && (
              <FinancialDetails initialData={profileData} />
            )}
          </div>
        </>
      ) : showCreateForm ? (
        <CreateRiderProfile
          onSuccess={fetchProfile}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl shadow-xl border border-gray-100 text-center">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
            <MdOutlineDeliveryDining className="text-5xl text-(--color-primary)" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Welcome Rider!
          </h2>
          <p className="text-gray-500 max-w-lg mb-8 text-lg">
            You haven't set up your rider profile yet. Add your vehicle,
            documents, and address details to get started and receive delivery
            orders.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-3 bg-(--color-primary) text-(--color-primary-content) px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <MdAddCircleOutline className="text-2xl" /> Create Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default RiderProfileContainer;

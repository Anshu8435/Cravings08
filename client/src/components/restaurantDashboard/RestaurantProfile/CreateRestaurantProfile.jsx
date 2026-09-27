import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineAddAPhoto, MdDelete, MdRestaurantMenu } from "react-icons/md";
import api from "../../../config/ApiConfig";
import runningLoader from "../../../assets/runningLoader.gif";
import BasicDetailsSection from "./sections/BasicDetailsSection";
import PhotosSection from "./sections/PhotosSection";
import DocumentsSection from "./sections/DocumentsSection";
import FinancialDetailsSection from "./sections/FinancialDetailsSection";
import ContactAndHoursSection from "./sections/ContactAndHoursSection";

const MAX_IMAGE_SIZE_BYTES = 2097152; // 1MB
const MAX_GALLERY_IMAGES = 8;

const CreateRestaurantProfile = ({ onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [restaurantImages, setRestaurantImages] = useState([]);
  const [restaurantImagesPreview, setRestaurantImagesPreview] = useState([]);

  const [formData, setFormData] = useState({
    restaurantName: "", address: "", city: "", state: "", pinCode: "", country: "", description: "", restaurantType: "both", cuisineTypes: "", lat: "", lon: "",
    legalName: "", companyType: "", gstCertificate: "", fssaiCertificate: "", panCard: "",
    bankName: "", accountNumber: "", ifscCode: "",
    contactEmail: "", contactPhone: "", openingTime: "", closingTime: "",
    facebookUrl: "", instagramUrl: "", twitterUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }));
          toast.success("Location fetched successfully!");
          setIsGettingLocation(false);
        },
        (error) => {
          toast.error("Failed to get location. Please allow location access.");
          setIsGettingLocation(false);
        }
      );
    } catch (error) {
      toast.error("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) return toast.error("Cover image size must be less than 1MB");
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRestaurantImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (restaurantImagesPreview.length + files.length > MAX_GALLERY_IMAGES) {
      return toast.error(`You can only upload up to ${MAX_GALLERY_IMAGES} gallery images.`);
    }
    const validFiles = [];
    const newPreviews = [];
    for (let file of files) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(`File ${file.name} is larger than 1MB and was skipped.`);
        continue;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }
    if (validFiles.length > 0) {
      setRestaurantImages((prev) => [...prev, ...validFiles]);
      setRestaurantImagesPreview((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeRestaurantImage = (index) => {
    setRestaurantImages((prev) => prev.filter((_, i) => i !== index));
    setRestaurantImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setUploadProgress(0);
      const payload = new FormData();
      
      // Basic Info
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

      // Documents
      payload.append("documents.legalName", formData.legalName);
      payload.append("documents.companyType", formData.companyType);
      payload.append("documents.gstCertificate", formData.gstCertificate);
      payload.append("documents.fssaiCertificate", formData.fssaiCertificate);
      payload.append("documents.panCard", formData.panCard);

      // Financials
      payload.append("financialDetails.bankName", formData.bankName);
      payload.append("financialDetails.accountNumber", formData.accountNumber);
      payload.append("financialDetails.ifscCode", formData.ifscCode);

      // Contact
      payload.append("contactDetails.email", formData.contactEmail);
      payload.append("contactDetails.phone", formData.contactPhone);
      payload.append("servingHours.openingTime", formData.openingTime);
      payload.append("servingHours.closingTime", formData.closingTime);

      // Social Media
      const socialLinks = [];
      if (formData.facebookUrl) socialLinks.push({ platform: "facebook", url: formData.facebookUrl });
      if (formData.instagramUrl) socialLinks.push({ platform: "instagram", url: formData.instagramUrl });
      if (formData.twitterUrl) socialLinks.push({ platform: "twitter", url: formData.twitterUrl });
      
      if (socialLinks.length > 0) {
        payload.append("socialMediaLinks", JSON.stringify(socialLinks));
      }

      if (coverImage) payload.append("coverImage", coverImage);
      if (restaurantImages.length > 0) {
        restaurantImages.forEach((image) => payload.append("restaurantImage", image));
      }

      const response = await api.post("/restaurant/update-profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      toast.success(response.data.message || "Restaurant Profile Created Successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create profile");
      setUploadProgress(0);
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
            <MdRestaurantMenu /> Let's Get Started!
          </h2>
          <p className="text-orange-100 max-w-2xl">
            Welcome to Cravings! To activate your restaurant dashboard, please complete your full profile below. You only need to do this once, and you can edit individual sections later!
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
      </div>

      <BasicDetailsSection 
        formData={formData} 
        handleChange={handleChange} 
        handleGetLocation={handleGetLocation} 
        isGettingLocation={isGettingLocation} 
      />

      <PhotosSection 
        coverImagePreview={coverImagePreview}
        handleCoverImageChange={handleCoverImageChange}
        restaurantImagesPreview={restaurantImagesPreview}
        handleRestaurantImagesChange={handleRestaurantImagesChange}
        removeRestaurantImage={removeRestaurantImage}
        MAX_GALLERY_IMAGES={MAX_GALLERY_IMAGES}
      />

      <DocumentsSection 
        formData={formData} 
        handleChange={handleChange} 
        partnerOptions={partnerOptions} 
        companyOptions={companyOptions} 
      />

      <FinancialDetailsSection 
        formData={formData} 
        handleChange={handleChange} 
      />

      <ContactAndHoursSection 
        formData={formData} 
        handleChange={handleChange} 
      />

      {/* SUBMIT BUTTON */}
      <div className="mt-8 flex justify-end gap-4">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isLoading}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        )}
        <button type="submit" disabled={isLoading} className="bg-(--color-primary) text-(--color-primary-content) px-8 py-3 rounded-xl font-bold text-lg disabled:bg-opacity-70 flex items-center justify-center gap-3 shadow-lg hover:shadow-orange-500/40 hover:bg-orange-700 transition-all transform hover:-translate-y-1">
          {isLoading ? (
            <>
              <img src={runningLoader} alt="Loading..." className="w-6 h-6 object-contain" />
              Adding... {uploadProgress > 0 ? `${uploadProgress}%` : ""}
            </>
          ) : (
            "Add Restaurant"
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateRestaurantProfile;

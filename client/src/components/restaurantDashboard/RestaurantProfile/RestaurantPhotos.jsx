import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdOutlineAddAPhoto, MdDelete, MdEdit } from "react-icons/md";
import api from "../../../config/ApiConfig";
import runningLoader from "../../../assets/runningLoader.gif";

const MAX_IMAGE_SIZE_BYTES = 1048576;//1MB
const MAX_GALLERY_IMAGES = 8;

const RestaurantPhotos = ({ initialData, onSuccess, activeRestaurantId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(
    initialData?.coverImage?.url || null,
  );

  const [restaurantImages, setRestaurantImages] = useState([]);
  const [existingImagesToKeep, setExistingImagesToKeep] = useState(
    initialData?.restaurantImage || [],
  );
  const [restaurantImagesPreview, setRestaurantImagesPreview] = useState(
    initialData?.restaurantImage?.map((img) => img.url) || [],
  );

  useEffect(() => {
    setCoverImagePreview(initialData?.coverImage?.url || null);
    setExistingImagesToKeep(initialData?.restaurantImage || []);
    setRestaurantImagesPreview(
      initialData?.restaurantImage?.map((img) => img.url) || [],
    );
  }, [initialData]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return toast.error("Cover image size must be less than 1MB");
      }
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRestaurantImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Check if adding these files exceeds the limit
    if (restaurantImagesPreview.length + files.length > MAX_GALLERY_IMAGES) {
      return toast.error(
        `You can only upload up to ${MAX_GALLERY_IMAGES} gallery images.`,
      );
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
    const isExisting = index < existingImagesToKeep.length;

    if (isExisting) {
      // Remove from existing images
      setExistingImagesToKeep((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new files (adjust index by subtracting existing images length)
      const newFileIndex = index - existingImagesToKeep.length;
      setRestaurantImages((prev) => prev.filter((_, i) => i !== newFileIndex));
    }

    // Remove from previews
    setRestaurantImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setCoverImagePreview(initialData?.coverImage?.url || null);
    setExistingImagesToKeep(initialData?.restaurantImage || []);
    setRestaurantImagesPreview(
      initialData?.restaurantImage?.map((img) => img.url) || [],
    );
    setCoverImage(null);
    setRestaurantImages([]);
    setIsEditing(false);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasDeletedImages =
      existingImagesToKeep.length !==
      (initialData?.restaurantImage?.length || 0);

    if (!coverImage && restaurantImages.length === 0 && !hasDeletedImages) {
      toast.error("No changes made.");
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(0);
      const payload = new FormData();
      if (activeRestaurantId) {
        payload.append("restaurantId", activeRestaurantId);
      }

      if (coverImage) {
        payload.append("coverImage", coverImage);
      }

      if (restaurantImages.length > 0) {
        restaurantImages.forEach((image) => {
          payload.append("restaurantImage", image);
        });
      }

      payload.append(
        "existingRestaurantImages",
        JSON.stringify(existingImagesToKeep),
      );

      // Simulate progress for Cloudinary upload which happens backend-side
      let simulatedProgress = 0;
      const progressInterval = setInterval(() => {
        simulatedProgress += Math.random() * 15;
        if (simulatedProgress > 92) simulatedProgress = 92;
        setUploadProgress(Math.floor(simulatedProgress));
      }, 500);

      const response = await api.post("/restaurant/update-profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success(response.data.message || "Images uploaded successfully!");
      setCoverImage(null);
      setRestaurantImages([]);
      setIsEditing(false);
      setUploadProgress(0);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload images");
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-(--color-base-300) overflow-hidden transform transition-all duration-300 hover:shadow-2xl relative group">
      {/* Cover Banner */}
      <div className="h-24 bg-linear-to-r from-(--color-primary) to-orange-500 relative">
        <div className="absolute top-4 right-4 z-10">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-white px-5 py-2 font-bold text-(--color-primary) shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(255,255,255,0.4)] text-sm"
            >
              <div className="absolute inset-0 bg-linear-to-r from-(--color-primary) to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover:text-white z-10">
                <MdEdit className="text-lg group-hover:rotate-12 transition-transform duration-300" />{" "}
                Edit Photos
              </span>
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-transparent border-2 border-white/60 hover:bg-white text-white hover:text-(--color-primary) px-5 py-1.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(255,255,255,0.2)] text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-white px-5 py-1.5 font-bold text-(--color-primary) shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(255,255,255,0.4)] text-sm disabled:opacity-70 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-linear-to-r from-(--color-primary) to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover:text-white z-10">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <img
                        src={runningLoader}
                        alt="loading"
                        className="w-5 h-5"
                      />{" "}
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
        <div className="absolute bottom-5 left-6 z-10 text-white">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <MdOutlineAddAPhoto /> Restaurant Photos
          </h3>
          <p className="text-orange-100 mt-1">
            Manage your restaurant cover and gallery images.
          </p>
        </div>
        {/* Decorative circle */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-8 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 flex flex-col h-full">
              <h4 className="font-bold mb-3 text-sm text-(--color-base-content) uppercase tracking-wide">
                Cover Image
              </h4>
              <div className="relative w-full grow min-h-75 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 group hover:border-(--color-primary) transition-colors duration-300 shadow-inner">
                {coverImagePreview ? (
                  <img
                    src={coverImagePreview}
                    alt="Cover Preview"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="flex flex-col items-center opacity-50 relative z-10">
                    <MdOutlineAddAPhoto className="text-5xl mb-2 text-gray-400" />
                    <span className="text-lg font-medium text-gray-500">
                      No Cover Image
                    </span>
                  </div>
                )}
                {isEditing && (
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white backdrop-blur-sm z-20">
                    <MdOutlineAddAPhoto className="text-5xl mb-3 animate-bounce" />
                    <span className="text-lg font-bold tracking-wide">
                      Upload Cover (Max 1MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col h-full">
              <div className="flex justify-between items-end mb-4">
                <h4 className="font-bold text-sm text-(--color-base-content) uppercase tracking-wide">
                  Gallery Images{" "}
                  <span className="text-gray-400 font-normal lowercase">
                    (Max 8, 1MB each)
                  </span>
                </h4>
                {isEditing && (
                  <label className="group relative cursor-pointer overflow-hidden rounded-xl bg-white border border-(--color-primary) px-5 py-2 font-bold text-(--color-primary) shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-(--color-primary)/20 text-sm flex items-center gap-2">
                    <div className="absolute inset-0 bg-linear-to-r from-(--color-primary) to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover:text-white z-10">
                      <MdOutlineAddAPhoto className="text-xl group-hover:scale-110 transition-transform duration-300" />{" "}
                      Add Gallery
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleRestaurantImagesChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-200 grow">
                {restaurantImagesPreview.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <img
                      src={src}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {isEditing && (
                      <>
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <button
                          type="button"
                          onClick={() => removeRestaurantImage(idx)}
                          className="absolute top-2 right-2 bg-red-500/90 backdrop-blur text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 hover:scale-110 transform duration-200"
                        >
                          <MdDelete className="text-sm" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {restaurantImagesPreview.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-white min-h-50">
                    <MdOutlineAddAPhoto className="text-5xl mb-3 opacity-30 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">
                      Upload gallery images to attract customers!
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right text-sm font-bold text-gray-500 mt-2">
                {restaurantImagesPreview.length} / {MAX_GALLERY_IMAGES} uploaded
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              {isLoading && uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-3 mt-10 mb-2">
                    <div
                      className="absolute -top-10 -translate-x-1/2 transition-all duration-300 z-10"
                      style={{ left: `${Math.max(2, uploadProgress)}%` }}
                    >
                      <img
                        src={runningLoader}
                        alt="running loader"
                        className="w-10 h-10 object-contain drop-shadow-md"
                      />
                    </div>
                    <div
                      className="bg-(--color-primary) h-3 rounded-full transition-all duration-300 relative overflow-hidden shadow-inner"
                      style={{ width: `${uploadProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RestaurantPhotos;

import React from "react";
import { MdOutlineAddAPhoto, MdDelete } from "react-icons/md";

const PhotosSection = ({
  coverImagePreview,
  handleCoverImageChange,
  restaurantImagesPreview,
  handleRestaurantImagesChange,
  removeRestaurantImage,
  MAX_GALLERY_IMAGES,
}) => {
  return (
    <div className="bg-(--color-base-100) p-4 sm:p-6 rounded-2xl shadow-md border border-(--color-base-300) hover:shadow-xl transition-all duration-300 transform">
      <h3 className="text-lg sm:text-xl font-bold text-(--color-base-content) border-b-2 border-(--color-primary) pb-2 inline-block mb-4 sm:mb-6">Restaurant Photos</h3>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Cover Image - 40% (col-span-2) */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <h4 className="font-bold mb-3 text-sm text-(--color-base-content) uppercase tracking-wide">Cover Image</h4>
          <div className="relative w-full grow min-h-75 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 group hover:border-(--color-primary) transition-colors duration-300 shadow-inner">
            {coverImagePreview ? (
              <img src={coverImagePreview} alt="Restaurant Cover Preview" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="flex flex-col items-center opacity-50 relative z-10">
                <MdOutlineAddAPhoto className="text-5xl mb-2 text-gray-400" />
                <span className="text-lg font-medium text-gray-500">No Cover Image</span>
              </div>
            )}
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white backdrop-blur-sm z-20">
              <MdOutlineAddAPhoto className="text-5xl mb-3 animate-bounce" />
              <span className="text-lg font-bold tracking-wide">Upload Cover (Max 1MB)</span>
              <input type="file" accept="image/*" required={!coverImagePreview} onChange={handleCoverImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Gallery Images - 60% (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <div className="flex justify-between items-end mb-4">
            <h4 className="font-bold text-sm text-(--color-base-content) uppercase tracking-wide">Gallery Images <span className="text-gray-400 font-normal lowercase">(Max 8, 1MB each)</span></h4>
            <label className="cursor-pointer bg-white border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 font-bold shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <MdOutlineAddAPhoto className="text-xl" /> Add Gallery
              <input type="file" accept="image/*" multiple onChange={handleRestaurantImagesChange} className="hidden" />
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-200 grow">
            {restaurantImagesPreview.map((src, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <img src={src} alt={`Restaurant Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button type="button" onClick={() => removeRestaurantImage(idx)} className="absolute top-2 right-2 bg-red-500/90 backdrop-blur text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 hover:scale-110 transform duration-200">
                  <MdDelete className="text-sm" />
                </button>
              </div>
            ))}
            {restaurantImagesPreview.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-white min-h-50">
                <MdOutlineAddAPhoto className="text-5xl mb-3 opacity-30 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Upload gallery images to attract customers!</span>
              </div>
            )}
          </div>
          <div className="text-right text-sm font-bold text-gray-500 mt-2">{restaurantImagesPreview.length} / {MAX_GALLERY_IMAGES} uploaded</div>
        </div>
      </div>
    </div>
  );
};

export default PhotosSection;

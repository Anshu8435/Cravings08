import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdCloseCircleOutline, IoMdImage } from 'react-icons/io';
import { FaTag, FaInfoCircle, FaRupeeSign, FaUtensils, FaLeaf, FaMotorcycle } from 'react-icons/fa';

const AddNewItemModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    price: '',
    category: 'Starter',
    type: 'Vegetarian',
    imageUrl: '',
    travelScore: 100,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: url,
        imageFile: file,
      }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: '',
      imageFile: null,
    }));
  };

  const handleAdd = () => {
    if (!formData.itemName || !formData.price || !formData.category) {
      toast.error('Please fill out the required fields: Item Name, Price, Category.');
      return;
    }
    onAdd(formData);
    setFormData({
      itemName: '',
      description: '',
      price: '',
      category: 'Starter',
      type: 'Vegetarian',
      imageUrl: '',
      travelScore: 100,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        {/* Modal Container */}
        <div
          style={{
            background: 'var(--cream)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-float)',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              background: 'var(--paper)',
              borderBottom: '1px solid var(--line)',
              padding: '18px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.45rem',
                  color: 'var(--ink)',
                  margin: 0,
                }}
              >
                Add New Dish
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>
                Create a new artisanal addition to your kitchen menu.
              </p>
            </div>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
              }}
              onClick={onClose}
            >
              <IoMdCloseCircleOutline size={26} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-4 lg:p-6 flex-1">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column: Image */}
              <div className="w-full md:w-1/3 flex flex-col gap-3">
                <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 aspect-square flex items-center justify-center">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center gap-2 pointer-events-none">
                      <IoMdImage
                        size={48}
                        className="opacity-50 group-hover:text-(--color-primary) transition-colors duration-300"
                      />
                      <span className="text-sm font-medium group-hover:text-(--color-primary) transition-colors duration-300">
                        Upload Image
                      </span>
                    </div>
                  )}

                  {!formData.imageUrl && (
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                    />
                  )}

                  {formData.imageUrl && (
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg transition-transform hover:scale-110 z-20"
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage();
                      }}
                      title="Remove image"
                    >
                      <IoMdCloseCircleOutline size={20} />
                    </button>
                  )}
                </div>

                {formData.imageUrl && (
                  <div>
                    <label className="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-orange-50 text-(--color-primary) border border-orange-200 rounded-xl font-bold text-sm hover:bg-orange-100 transition-colors shadow-sm">
                      <span>Change Image</span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Right Column: Details */}
              <div className="w-full md:w-2/3 flex flex-col gap-3">
                {/* Item Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    <FaTag className="text-(--color-primary) opacity-80" /> Item Name{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 shadow-inner focus:border-(--color-primary) focus:ring-2 focus:ring-orange-200 text-gray-900 dark:text-white px-3 py-2 font-medium transition-all outline-none"
                    value={formData.itemName}
                    onChange={handleChange}
                    placeholder="e.g. Signature Garlic Bread"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    <FaInfoCircle className="text-(--color-primary) opacity-80" /> Description
                  </label>
                  <textarea
                    name="description"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 shadow-inner focus:border-(--color-primary) focus:ring-2 focus:ring-orange-200 text-gray-900 dark:text-white px-3 py-2 text-sm transition-all resize-none outline-none"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g. Warm, crusty bread topped with our special garlic butter blend."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Price */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      <FaRupeeSign className="text-(--color-primary) opacity-80" /> Price{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 shadow-inner focus:border-(--color-primary) focus:ring-2 focus:ring-orange-200 text-gray-900 dark:text-white px-3 py-2 font-bold transition-all outline-none"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="150"
                    />
                  </div>
                  {/* Category */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      <FaUtensils className="text-(--color-primary) opacity-80" /> Category{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 shadow-inner focus:border-(--color-primary) focus:ring-2 focus:ring-orange-200 text-gray-900 dark:text-white px-3 py-2 font-medium transition-all cursor-pointer outline-none"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="Starter">Starter</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Burger">Burger</option>
                      <option value="Biryani">Biryani</option>
                      <option value="Rice">Rice</option>
                      <option value="Seafood">Seafood</option>
                      <option value="Wrap">Wrap</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {/* Menu Type */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      <FaLeaf className="text-(--color-primary) opacity-80" /> Menu Type{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 shadow-inner focus:border-(--color-primary) focus:ring-2 focus:ring-orange-200 text-gray-900 dark:text-white px-3 py-2 font-medium transition-all cursor-pointer outline-none"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                    </select>
                  </div>
                  {/* Travel-Ability Score */}
                  <div className="sm:col-span-2 lg:col-span-3 mt-2">
                    <label className="flex justify-between items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <FaMotorcycle className="text-(--color-primary) opacity-80" />{' '}
                        Travel-Ability Score
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs text-white ${formData.travelScore >= 80 ? 'bg-green-500' : formData.travelScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      >
                        {formData.travelScore}/100
                      </span>
                    </label>
                    <input
                      type="range"
                      name="travelScore"
                      min="1"
                      max="100"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-(--color-primary) dark:bg-gray-700 outline-none"
                      value={formData.travelScore}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500 mt-1 flex justify-between">
                      <span>Low (Melts/Spoils)</span>
                      <span>High (Travels Well)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div
            style={{
              background: 'var(--paper)',
              padding: '16px 24px',
              borderTop: '1px solid var(--line)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}
          >
            <button
              type="button"
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                background: 'var(--cream)',
                color: 'var(--ink)',
                fontWeight: '600',
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button-primary"
              style={{ padding: '9px 24px', fontSize: '0.88rem' }}
              onClick={handleAdd}
            >
              Create Item
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewItemModal;

import React, { useState, useEffect } from "react";
import { FaAward, FaRegGrinStars } from "react-icons/fa";
import { BiSolidDish } from "react-icons/bi";
import { LuPencilLine, LuTrash2, LuEye, LuChevronDown } from "react-icons/lu";
import { AiTwotoneLike } from "react-icons/ai";
import { IoMdAddCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import ConfirmModal from "./menuItems/ConfirmModal";
import AddNewItemModal from "./menuItems/AddNewItemModal";
import EditOrViewItem from "./menuItems/EditOrViewItem";
import MenuItemRow from "./menuItems/MenuItemRow";
import { statusChipStyles, statusLabels } from "./menuItems/menuData";
import api from "../../config/ApiConfig.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import runningLoader from "../../assets/runningLoader.gif";

const RestaurantMenu = ({ activeRestaurantId }) => {
  const { user } = useAuth();
  const restaurantId = activeRestaurantId || user?._id;
  const [menuItems, setMenuItems] = useState([]);

  const [isAddNewItemModalOpen, setIsAddNewItemModalOpen] = useState(false);
  const [isEditViewItemModalOpen, setIsEditViewItemModalOpen] = useState(false);
  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      if (!restaurantId) return;
      setIsLoading(true);
      try {
        const response = await api.get(`/menu/${restaurantId}`);
        if (response.data.success) {
          setMenuItems(response.data.data || []);
        }
      } catch (error) {
        showToast(
          error.response?.data?.message || "Failed to load menu",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConfirmAction = async () => {
    setIsProcessing(true);
    try {
      if (modalMode === "delete") {
        await api.delete(`/menu/delete/${selectedItem._id}`, {
          data: { restaurantId },
        });
        setMenuItems((prev) => prev.filter((m) => m._id !== selectedItem._id));
        showToast("Item deleted successfully!");
      } else {
        const toggleFieldMap = {
          topRated: "isTopRated",
          recommended: "isRecommended",
          new: "isNew",
        };
        const field = toggleFieldMap[modalMode];
        if (field) {
          const newValue = !selectedItem[field];
          const response = await api.put(`/menu/update/${selectedItem._id}`, {
            restaurantId,
            [field]: newValue,
          });
          if (response.data.success) {
            setMenuItems((prev) =>
              prev.map((m) =>
                m._id === selectedItem._id ? { ...m, [field]: newValue } : m,
              ),
            );
            showToast(`${modalMode} status updated!`);
          }
        }
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Action failed", "error");
    }
    setIsControlsModalOpen(false);
    setIsProcessing(false);
  };

  const handleEditItem = async (updatedItem) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("restaurantId", restaurantId);
      if (updatedItem.itemName !== selectedItem.itemName)
        formData.append("itemName", updatedItem.itemName);
      if (updatedItem.description !== selectedItem.description)
        formData.append("description", updatedItem.description);
      if (updatedItem.price !== selectedItem.price)
        formData.append("price", updatedItem.price);
      if (updatedItem.category !== selectedItem.category)
        formData.append("category", updatedItem.category);
      if (updatedItem.type !== selectedItem.type)
        formData.append("type", updatedItem.type);

      if (updatedItem.imageFile) {
        formData.append("image", updatedItem.imageFile);
      } else if (!updatedItem.imageUrl && selectedItem.image?.url) {
        formData.append("removeImage", "true");
      }

      const response = await api.put(
        `/menu/update/${selectedItem._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (response.data.success) {
        setMenuItems((prev) =>
          prev.map((m) =>
            m._id === selectedItem._id ? response.data.data : m,
          ),
        );
        showToast("Item updated successfully!");
        setIsEditViewItemModalOpen(false);
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to update item",
        "error",
      );
    }
    setIsProcessing(false);
  };

  const handleAddItem = async (newItem) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("restaurantId", restaurantId);
      formData.append("itemName", newItem.itemName);
      formData.append("description", newItem.description || "");
      formData.append("price", newItem.price);
      formData.append("category", newItem.category);
      formData.append("type", newItem.type);
      formData.append("isNew", "true");

      if (newItem.imageFile) {
        formData.append("image", newItem.imageFile);
      }

      const response = await api.post("/menu/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setMenuItems((prev) => [response.data.data, ...prev]);
        showToast("Item added successfully!");
        setIsAddNewItemModalOpen(false);
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to add item", "error");
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="overflow-y-auto h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 mb-6 gap-4 sm:gap-0">
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">
            <button
              className="hover:bg-(--color-primary) border border-(--color-primary) text-(--color-primary) hover:text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
              onClick={() => {
                if (!user) {
                  showToast("first login", "error");
                  return;
                }
                if (user.userType !== "restaurant") {
                  showToast("only restaurant can add menu items", "error");
                  return;
                }
                setIsAddNewItemModalOpen(true);
              }}
            >
              <IoMdAddCircleOutline />
              Add New Item
            </button>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-(--color-primary) rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-colors w-full sm:w-auto"
            />
          </div>
        </div>
        <div className="bg-(--color-base-200) p-2 sm:p-4 rounded-lg">
          <div className="hidden lg:grid text-(--color-primary) grid-cols-7 gap-4 font-bold border-b border-(--color-secondary) py-2 px-2">
            <div className="col-span-2">Item Name & Description</div>
            <div className="text-center">Price</div>
            <div>Category & Type</div>
            <div>Status</div>
            <div>Controls</div>
            <div>Actions</div>
          </div>
          <div className="overflow-y-auto max-h-[65vh] pr-1 sm:pr-2 mt-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <img
                  src={runningLoader}
                  alt="Loading..."
                  className="w-16 h-16 object-contain mb-4"
                />
                <p className="text-gray-500 font-semibold text-lg animate-pulse">
                  Loading menu items...
                </p>
              </div>
            ) : filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item, index) => (
                <MenuItemRow
                  key={item._id || index}
                  item={item}
                  restaurantId={restaurantId}
                  setMenuItems={setMenuItems}
                  setIsProcessing={setIsProcessing}
                  showToast={showToast}
                  setSelectedItem={setSelectedItem}
                  setModalMode={setModalMode}
                  setIsControlsModalOpen={setIsControlsModalOpen}
                  setIsEditViewItemModalOpen={setIsEditViewItemModalOpen}
                />
              ))
            ) : (
              <div className="text-center py-20 text-gray-500 font-semibold text-lg">
                No menu items found.
              </div>
            )}
          </div>
        </div>
      </div>

      {isControlsModalOpen && (
        <ConfirmModal
          selectedItem={selectedItem}
          modalMode={modalMode}
          isOpen={isControlsModalOpen}
          onClose={() => setIsControlsModalOpen(false)}
          onConfirm={handleConfirmAction}
        />
      )}

      {isAddNewItemModalOpen && (
        <AddNewItemModal
          isOpen={isAddNewItemModalOpen}
          onClose={() => setIsAddNewItemModalOpen(false)}
          onAdd={handleAddItem}
        />
      )}

      {isEditViewItemModalOpen && (
        <EditOrViewItem
          selectedItem={selectedItem}
          modalMode={modalMode}
          isOpen={isEditViewItemModalOpen}
          onClose={() => setIsEditViewItemModalOpen(false)}
          onSave={handleEditItem}
        />
      )}

      {isProcessing && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <img
            src={runningLoader}
            alt="Processing..."
            className="w-16 h-16 object-contain mb-4"
          />
          <p className="text-white font-semibold text-lg drop-shadow-md animate-pulse">
            Processing...
          </p>
        </div>
      )}

      {toast.show && (
        <div
          className={`fixed top-8 left-1/2 -translate-x-1/2 z-200 px-6 py-3 rounded-lg shadow-xl text-white font-semibold transition-all duration-300 animate-bounce ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
};

export default RestaurantMenu;

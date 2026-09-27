import React from "react";
import { FaAward } from "react-icons/fa";
import { AiTwotoneLike } from "react-icons/ai";
import { LuChevronDown, LuPencilLine, LuEye, LuTrash2 } from "react-icons/lu";
import { statusChipStyles, statusLabels } from "./menuData";
import api from "../../../config/ApiConfig.jsx";

const MenuItemRow = ({
  item,
  restaurantId,
  setMenuItems,
  setIsProcessing,
  showToast,
  setSelectedItem,
  setModalMode,
  setIsControlsModalOpen,
  setIsEditViewItemModalOpen,
}) => {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-7 gap-3 lg:gap-4 bg-(--color-base-100) p-4 mb-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-(--color-secondary) hover:-translate-y-0.5 items-start lg:items-center">
      <div className="col-span-2 flex items-start sm:items-center gap-4 w-full">
        <img
          src={
            item.image?.url ||
            "https://picsum.photos/seed/fallback/600/600"
          }
          alt={item.itemName}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded shadow-sm"
        />
        <div className="flex-1">
          <div className="font-bold text-lg leading-tight mb-1">
            {item.itemName}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 leading-snug">
            {item.description}
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full lg:w-auto lg:block lg:text-center mt-2 lg:mt-0">
        <span className="lg:hidden font-semibold text-gray-600 text-sm">
          Price:
        </span>
        <span className="font-bold text-gray-800">
          ₹ {item.price.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between w-full lg:w-auto lg:block border-t border-dashed border-gray-200 lg:border-0 pt-2 lg:pt-0">
        <span className="lg:hidden font-semibold text-gray-600 text-sm">
          Category:
        </span>
        <div className="text-right lg:text-left">
          <div className="font-semibold text-gray-800">
            {item.category}
          </div>
          <div className="text-xs text-gray-500">{item.type}</div>
        </div>
      </div>
      <div className="flex justify-between items-center w-full lg:w-auto lg:block border-t border-dashed border-gray-200 lg:border-0 pt-2 lg:pt-0">
        <span className="lg:hidden font-semibold text-gray-600 text-sm">
          Status:
        </span>
        <div className="relative inline-flex items-center">
          <select
            value={item.status}
            className={`appearance-none rounded-md pl-3 pr-8 py-1.5 text-xs font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--color-primary) ${
              statusChipStyles[item.status]
            }`}
            onChange={async (e) => {
              const newStatus = e.target.value;
              setIsProcessing(true);
              try {
                const response = await api.put(
                  `/menu/update/${item._id}`,
                  {
                    restaurantId,
                    status: newStatus,
                  }
                );
                if (response.data.success) {
                  setMenuItems((prev) =>
                    prev.map((m) =>
                      m._id === item._id
                        ? { ...m, status: newStatus }
                        : m
                    )
                  );
                  showToast(`Status updated to ${newStatus}!`);
                }
              } catch (error) {
                showToast(
                  error.response?.data?.message ||
                    "Failed to update status",
                  "error"
                );
              }
              setIsProcessing(false);
            }}
          >
            <option value="available">
              {statusLabels.available}
            </option>
            <option value="unavailable">
              {statusLabels.unavailable}
            </option>
            <option value="discontinued">
              {statusLabels.discontinued}
            </option>
          </select>
          <LuChevronDown className="pointer-events-none absolute right-2 text-xs opacity-70" />
        </div>
      </div>

      <div className="flex justify-between items-center w-full lg:w-auto lg:block border-t border-dashed border-gray-200 lg:border-0 pt-2 lg:pt-0">
        <span className="lg:hidden font-semibold text-gray-600 text-sm">
          Controls:
        </span>
        <div className="flex gap-2">
          <button
            className={`rounded flex items-center justify-center p-1 hover:bg-gray-100 transition-colors ${
              item.isTopRated
                ? " text-(--color-primary)"
                : "text-(--color-secondary)"
            }`}
            title={
              item.isTopRated ? "Top Rated" : "Mark as Top Rated"
            }
            onClick={() => {
              setSelectedItem(item);
              setModalMode("topRated");
              setIsControlsModalOpen(true);
            }}
          >
            <FaAward size={18} />
          </button>
          <button
            className={`rounded flex items-center justify-center p-1 hover:bg-gray-100 transition-colors ${
              item.isRecommended
                ? "text-(--color-primary)"
                : "text-(--color-secondary)"
            }`}
            onClick={() => {
              setSelectedItem(item);
              setModalMode("recommended");
              setIsControlsModalOpen(true);
            }}
            title={
              item.isRecommended
                ? "Recommended"
                : "Mark as Recommended"
            }
          >
            <AiTwotoneLike size={18} />
          </button>
          <button
            className={`px-2 py-0.5 rounded flex items-center justify-center text-xs font-semibold transition-colors ${
              item.isNew
                ? "text-white bg-(--color-primary) border border-(--color-primary)"
                : "text-(--color-secondary) border border-(--color-secondary) hover:bg-gray-100"
            }`}
            onClick={() => {
              setSelectedItem(item);
              setModalMode("new");
              setIsControlsModalOpen(true);
            }}
            title={item.isNew ? "New Item" : "Mark as New"}
          >
            New
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center w-full lg:w-auto lg:block border-t border-dashed border-gray-200 lg:border-0 pt-2 lg:pt-0 pb-1 lg:pb-0">
        <span className="lg:hidden font-semibold text-gray-600 text-sm">
          Actions:
        </span>
        <div className="flex gap-2">
          <button
            className="px-2 py-1.5 border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white rounded transition-colors"
            title="Edit Item"
            onClick={() => {
              setSelectedItem(item);
              setModalMode("edit");
              setIsEditViewItemModalOpen(true);
            }}
          >
            <LuPencilLine size={16} />
          </button>
          <button
            className="px-2 py-1.5 border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-white rounded transition-colors"
            title="View Item Details"
            onClick={() => {
              setSelectedItem(item);
              setModalMode("view");
              setIsEditViewItemModalOpen(true);
            }}
          >
            <LuEye size={16} />
          </button>
          <button
            className="px-2 py-1.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
            title="Delete Item"
            onClick={() => {
              setSelectedItem(item);
              setModalMode("delete");
              setIsControlsModalOpen(true);
            }}
          >
            <LuTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemRow;

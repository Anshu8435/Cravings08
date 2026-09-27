import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaExclamationTriangle, FaTrashAlt, FaInfoCircle } from "react-icons/fa";

const ConfirmModal = ({ selectedItem, modalMode, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const isDelete = modalMode === "delete";

  const getModalConfig = () => {
    switch (modalMode) {
      case "delete":
        return {
          title: "Delete Menu Item",
          desc: "Are you sure you want to delete this item? This action cannot be undone.",
          icon: <FaTrashAlt size={28} className="text-red-500" />,
          bgClass: "bg-red-50",
          iconBg: "bg-red-100",
          btnClass: "bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-red-500/30 text-white shadow-lg",
          btnText: "Yes, Delete It"
        };
      case "topRated":
        return {
          title: "Update Top Rated Status",
          desc: "Are you sure you want to change the Top Rated status of this item?",
          icon: <FaInfoCircle size={32} className="text-(--color-primary)" />,
          bgClass: "bg-orange-50",
          iconBg: "bg-orange-100",
          btnClass: "bg-gradient-to-r from-(--color-primary) to-orange-500 hover:shadow-orange-500/30 text-white shadow-lg",
          btnText: "Confirm Update"
        };
      case "recommended":
        return {
          title: "Update Recommended Status",
          desc: "Are you sure you want to change the Recommended status of this item?",
          icon: <FaInfoCircle size={32} className="text-(--color-primary)" />,
          bgClass: "bg-orange-50",
          iconBg: "bg-orange-100",
          btnClass: "bg-gradient-to-r from-(--color-primary) to-orange-500 hover:shadow-orange-500/30 text-white shadow-lg",
          btnText: "Confirm Update"
        };
      case "new":
        return {
          title: "Update New Status",
          desc: "Are you sure you want to change the New status of this item?",
          icon: <FaInfoCircle size={32} className="text-(--color-primary)" />,
          bgClass: "bg-orange-50",
          iconBg: "bg-orange-100",
          btnClass: "bg-gradient-to-r from-(--color-primary) to-orange-500 hover:shadow-orange-500/30 text-white shadow-lg",
          btnText: "Confirm Update"
        };
      default:
        return {
          title: "Are you sure?",
          desc: "Do you want to proceed with this action?",
          icon: <FaExclamationTriangle size={32} className="text-yellow-500" />,
          bgClass: "bg-yellow-50",
          iconBg: "bg-yellow-100",
          btnClass: "bg-gradient-to-r from-yellow-500 to-amber-500 hover:shadow-yellow-500/30 text-white shadow-lg",
          btnText: "Confirm"
        };
    }
  };

  const config = getModalConfig();

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Header Region */}
          <div className="relative pt-8 px-6 flex flex-col items-center text-center">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-transform hover:scale-110 hover:rotate-90 duration-300"
              onClick={onClose}
            >
              <IoMdCloseCircleOutline size={28} />
            </button>
            
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${config.iconBg} shadow-inner`}>
              {config.icon}
            </div>
            
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              {config.title}
            </h1>
            
            {selectedItem && (
              <p className="text-sm font-bold text-(--color-primary) mb-2">
                Target: {selectedItem.itemName}
              </p>
            )}

            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-6 px-4">
              {config.desc}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-center gap-3 w-full">
            <button
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-bold shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full sm:w-1/2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-6 py-3 rounded-xl font-bold hover:-translate-y-0.5 transition-all w-full sm:w-1/2 ${config.btnClass}`}
              onClick={onConfirm}
            >
              {config.btnText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;

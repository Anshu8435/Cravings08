import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import RestaurantOverview from "../../components/restaurantDashboard/RestaurantOverview";
import RestaurantMenu from "../../components/restaurantDashboard/RestaurantMenu";
import RestaurantSetting from "../../components/restaurantDashboard/RestaurantSetting";
import RestaurantOrders from "../../components/restaurantDashboard/RestaurantOrders";
import { MdDashboard, MdRestaurantMenu } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import api from "../../config/ApiConfig";

const RestaurantDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.state?.activeTab;
  const [activeTab, setActiveTab] = useState(active || "overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [restaurants, setRestaurants] = useState([]);
  const [activeRestaurantId, setActiveRestaurantId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get("/restaurant/get-profile");
      if (response.data?.data && Array.isArray(response.data.data)) {
        setRestaurants(response.data.data);
        if (response.data.data.length > 0 && !activeRestaurantId) {
          setActiveRestaurantId(response.data.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching restaurants", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin && role === "restaurant") {
      fetchRestaurants();
    }
  }, [isLogin, role]);

  const mainTabs = [
    { name: "Overview", value: "overview", icon: <MdDashboard size={20} /> },
    { name: "Menu", value: "menu", icon: <MdRestaurantMenu size={20} /> },
    { name: "Orders", value: "orders", icon: <FaShoppingCart size={20} /> },
  ];
  const settingsTab = { name: "Settings", value: "settings", icon: <IoMdSettings size={20} /> };

  const dropdownOptions = restaurants.map(r => ({ label: r.restaurantName, value: r._id }));

  if (!isLogin || role !== "restaurant") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')]  bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center ">
          <h1 className="text-2xl font-bold text-(--color-neutral-content)">
            Access Denied. Please log in as a Restaurant Manager to view this
            page.
          </h1>
          <button
            className="mt-4 px-4 py-2 bg-(--color-primary) text-white rounded-md"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="h-[calc(100vh-64px)] flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden relative">
      {/* Mobile Header for Hamburger */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40 shrink-0 shadow-sm">
        <span className="font-bold text-xl text-gray-800 dark:text-white">Restaurant Dashboard</span>
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-(--color-primary) hover:bg-gray-200 transition-colors"
        >
          {isMobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar Wrapper */}
      <div className={`
        fixed lg:relative top-[64px] lg:top-0 left-0 h-[calc(100vh-64px)] lg:h-full shrink-0 z-50
        transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); setIsMobileSidebarOpen(false); }}
          mainTabs={mainTabs}
          settingsTab={settingsTab}
          subtitle="Restaurant"
          dropdownOptions={dropdownOptions}
          selectedDropdownValue={activeRestaurantId}
          onDropdownChange={setActiveRestaurantId}
        />
      </div>

      {/* Overlay for mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden top-[64px]"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 bg-(--color-base-100) p-4 rounded-2xl shadow-xl h-full overflow-y-auto w-full">
        {activeTab === "overview" && <RestaurantOverview activeRestaurantId={activeRestaurantId} restaurants={restaurants} refreshRestaurants={fetchRestaurants} />}
        {activeTab === "menu" && <RestaurantMenu activeRestaurantId={activeRestaurantId} />}
        {activeTab === "orders" && <RestaurantOrders activeRestaurantId={activeRestaurantId} />}
        {activeTab === "settings" && <RestaurantSetting activeRestaurantId={activeRestaurantId} refreshRestaurants={fetchRestaurants} restaurants={restaurants} />}
      </div>
    </div>
  );
};

export default RestaurantDashboard;

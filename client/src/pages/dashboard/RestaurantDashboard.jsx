import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import RestaurantOverview from '../../components/restaurantDashboard/RestaurantOverview';
import RestaurantMenu from '../../components/restaurantDashboard/RestaurantMenu';
import RestaurantSetting from '../../components/restaurantDashboard/RestaurantSetting';
import RestaurantOrders from '../../components/restaurantDashboard/RestaurantOrders';
import { MdDashboard, MdRestaurantMenu } from 'react-icons/md';
import { FaShoppingCart } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { FiMenu, FiX } from 'react-icons/fi';
import api from '../../config/ApiConfig';

const RestaurantDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.state?.activeTab;
  const [activeTab, setActiveTab] = useState(active || 'overview');
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
      const response = await api.get('/restaurant/get-profile');
      if (response.data?.data && Array.isArray(response.data.data)) {
        setRestaurants(response.data.data);
        if (response.data.data.length > 0 && !activeRestaurantId) {
          setActiveRestaurantId(response.data.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching restaurants', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin && role === 'restaurant') {
      fetchRestaurants();
    }
  }, [isLogin, role]);

  const mainTabs = [
    { name: 'Overview', value: 'overview', icon: <MdDashboard size={20} /> },
    { name: 'Menu', value: 'menu', icon: <MdRestaurantMenu size={20} /> },
    { name: 'Orders', value: 'orders', icon: <FaShoppingCart size={20} /> },
  ];
  const settingsTab = { name: 'Settings', value: 'settings', icon: <IoMdSettings size={20} /> };

  const dropdownOptions = restaurants.map((r) => ({ label: r.restaurantName, value: r._id }));

  if (!isLogin || role !== 'restaurant') {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')]  bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center ">
          <h1 className="text-2xl font-bold text-(--color-neutral-content)">
            Access Denied. Please log in as a Restaurant Manager to view this page.
          </h1>
          <button
            className="mt-4 px-4 py-2 bg-(--color-primary) text-white rounded-md"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-72px)] flex flex-col lg:flex-row overflow-hidden relative bg-[#080a11] text-gray-100 selection:bg-[#ff5400] selection:text-white">
      {/* Mobile Header for Hamburger */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#0e121d] border-b border-white/10 z-40 shrink-0 shadow-sm">
        <span className="font-black text-xl text-white font-['Space_Grotesk']">
          Restaurant Dashboard
        </span>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 bg-white/5 rounded-xl text-[#ff5400] hover:bg-white/10 transition-colors"
        >
          {isMobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar Wrapper */}
      <div
        className={`
        fixed lg:relative top-[72px] lg:top-0 left-0 h-[calc(100vh-72px)] lg:h-full shrink-0 z-50
        transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden top-[72px]"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 bg-[#0b0e17] p-4 sm:p-6 rounded-3xl shadow-2xl h-full overflow-y-auto w-full border border-white/10 m-0 lg:m-2">
        {activeTab === 'overview' && (
          <RestaurantOverview
            activeRestaurantId={activeRestaurantId}
            restaurants={restaurants}
            refreshRestaurants={fetchRestaurants}
          />
        )}
        {activeTab === 'menu' && <RestaurantMenu activeRestaurantId={activeRestaurantId} />}
        {activeTab === 'orders' && <RestaurantOrders activeRestaurantId={activeRestaurantId} />}
        {activeTab === 'settings' && (
          <RestaurantSetting
            activeRestaurantId={activeRestaurantId}
            refreshRestaurants={fetchRestaurants}
            restaurants={restaurants}
          />
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;

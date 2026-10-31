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
import api from '../../config/ApiConfig';

const RestaurantDashboard = () => {
  const { user, isLogin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.state?.activeTab;
  const [activeTab, setActiveTab] = useState(active || 'overview');

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
    { name: 'Overview', value: 'overview', icon: <MdDashboard size={18} /> },
    { name: 'Menu', value: 'menu', icon: <MdRestaurantMenu size={18} /> },
    { name: 'Orders', value: 'orders', icon: <FaShoppingCart size={18} /> },
  ];
  const settingsTab = { name: 'Settings', value: 'settings', icon: <IoMdSettings size={18} /> };

  const dropdownOptions = restaurants.map((r) => ({ label: r.restaurantName, value: r._id }));

  if (!isLogin || role !== 'restaurant') {
    return (
      <main className="page-wrap wrap">
        <div className="empty-state">
          <span className="empty-mark">🔒</span>
          <h2>Access Denied</h2>
          <p>Please log in as a Restaurant Partner to manage your kitchen.</p>
          <button
            className="button button-primary"
            onClick={() => navigate('/login')}
            style={{ marginTop: '14px' }}
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'R';

  return (
    <main className="dashboard-shell wrap">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mainTabs={mainTabs}
        settingsTab={settingsTab}
        title="Kitchen"
        subtitle="Restaurant partner"
        dropdownOptions={dropdownOptions}
        selectedDropdownValue={activeRestaurantId}
        onDropdownChange={(val) => setActiveRestaurantId(val)}
      />

      <section className="dashboard-content">
        <div className="dashboard-topline">
          <div>
            <p className="eyebrow">RESTAURANT · PARTNER WORKSPACE</p>
            <h1>
              {activeTab === 'overview'
                ? 'Kitchen overview'
                : activeTab === 'menu'
                  ? 'Menu management'
                  : activeTab === 'orders'
                    ? 'Incoming orders'
                    : 'Restaurant settings'}
            </h1>
            <p>
              Manage dishes, toggle item availability, review customer orders, and update operating
              hours.
            </p>
          </div>
          <span className="avatar avatar-small">{initial}</span>
        </div>

        <div style={{ minWidth: 0 }}>
          {activeTab === 'overview' && (
            <RestaurantOverview
              activeRestaurantId={activeRestaurantId}
              setActiveRestaurantId={setActiveRestaurantId}
              restaurants={restaurants}
            />
          )}
          {activeTab === 'menu' && (
            <RestaurantMenu
              activeRestaurantId={activeRestaurantId}
              setActiveRestaurantId={setActiveRestaurantId}
              restaurants={restaurants}
            />
          )}
          {activeTab === 'orders' && (
            <RestaurantOrders
              activeRestaurantId={activeRestaurantId}
              setActiveRestaurantId={setActiveRestaurantId}
              restaurants={restaurants}
            />
          )}
          {activeTab === 'settings' && (
            <RestaurantSetting
              activeRestaurantId={activeRestaurantId}
              setActiveRestaurantId={setActiveRestaurantId}
              restaurants={restaurants}
              fetchRestaurants={fetchRestaurants}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default RestaurantDashboard;

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSetting from '../../components/adminDashboard/AdminSetting';
import Sidebar from '../../components/Sidebar';
import AdminOverview from '../../components/adminDashboard/AdminOverview';
import AdminOrders from '../../components/adminDashboard/AdminOrders';
import AdminRestaurants from '../../components/adminDashboard/AdminRestaurants';
import { MdDashboard, MdRestaurant } from 'react-icons/md';
import { FaShoppingCart } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

const AdminDashboard = () => {
  const { user, isLogin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.state?.activeTab;
  const [activeTab, setActiveTab] = React.useState(active || 'overview');

  React.useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const mainTabs = [
    { name: 'Overview', value: 'overview', icon: <MdDashboard size={18} /> },
    { name: 'Global Orders', value: 'orders', icon: <FaShoppingCart size={18} /> },
    { name: 'Kitchen Partners', value: 'restaurants', icon: <MdRestaurant size={18} /> },
  ];
  const settingsTab = { name: 'Settings', value: 'settings', icon: <IoMdSettings size={18} /> };

  if (!isLogin || role !== 'admin') {
    return (
      <main className="page-wrap wrap">
        <div className="empty-state">
          <span className="empty-mark">🔒</span>
          <h2>Access Denied</h2>
          <p>Administrator credentials required to access this system console.</p>
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

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'AD';

  return (
    <main className="dashboard-shell wrap">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mainTabs={mainTabs}
        settingsTab={settingsTab}
        title="Admin"
        subtitle="Platform admin"
      />

      <section className="dashboard-content">
        <div className="dashboard-topline">
          <div>
            <p className="eyebrow">ADMINISTRATOR · PLATFORM CONSOLE</p>
            <h1>
              {activeTab === 'overview'
                ? 'System overview'
                : activeTab === 'orders'
                  ? 'Global orders monitor'
                  : activeTab === 'restaurants'
                    ? 'Restaurant partner verification'
                    : 'Platform settings'}
            </h1>
            <p>
              Review restaurant onboarding documents, oversee orders across all districts, and
              monitor live metrics.
            </p>
          </div>
          <span className="avatar avatar-small">{initial}</span>
        </div>

        <div style={{ minWidth: 0 }}>
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'restaurants' && <AdminRestaurants />}
          {activeTab === 'settings' && <AdminSetting />}
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;

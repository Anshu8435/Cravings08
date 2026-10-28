import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import CustomerOverview from '../../components/customerDashboard/CustomerOverview';
import CustomerOrders from '../../components/customerDashboard/CustomerOrders';
import CustomerSetting from '../../components/customerDashboard/CustomerSetting';
import { MdDashboard } from 'react-icons/md';
import { FaShoppingCart } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

const CustomerDashboard = () => {
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
    { name: 'My Orders', value: 'orders', icon: <FaShoppingCart size={18} /> },
  ];
  const settingsTab = { name: 'Settings', value: 'settings', icon: <IoMdSettings size={18} /> };

  if (!isLogin || role !== 'customer') {
    return (
      <main className="page-wrap wrap">
        <div className="empty-state">
          <span className="empty-mark">🔒</span>
          <h2>Access Denied</h2>
          <p>Please log in with a customer account to view your dashboard.</p>
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

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'C';

  return (
    <main className="dashboard-shell wrap">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mainTabs={mainTabs}
        settingsTab={settingsTab}
        subtitle="Customer"
      />

      <section className="dashboard-content">
        <div className="dashboard-topline">
          <div>
            <p className="eyebrow">CUSTOMER · WORKSPACE</p>
            <h1>
              {activeTab === 'overview'
                ? 'Account overview'
                : activeTab === 'orders'
                  ? 'My orders'
                  : 'Profile & settings'}
            </h1>
            <p>Track your active food deliveries, view past orders, and manage addresses.</p>
          </div>
          <span className="avatar avatar-small">{initial}</span>
        </div>

        <div style={{ minWidth: 0 }}>
          {activeTab === 'overview' && <CustomerOverview />}
          {activeTab === 'orders' && <CustomerOrders />}
          {activeTab === 'settings' && <CustomerSetting />}
        </div>
      </section>
    </main>
  );
};

export default CustomerDashboard;

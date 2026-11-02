import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import RiderOverview from '../../components/riderDashboard/RiderOverview';
import RiderOrders from '../../components/riderDashboard/RiderOrders';
import RiderSetting from '../../components/riderDashboard/RiderSetting';
import RiderProfileContainer from '../../components/riderDashboard/RiderProfile/RiderProfile';
import { MdDashboard } from 'react-icons/md';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

const RiderDashboard = () => {
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
    { name: 'Deliveries', value: 'orders', icon: <FaShoppingCart size={18} /> },
    { name: 'KYC Profile', value: 'profile', icon: <FaUserCircle size={18} /> },
  ];
  const settingsTab = { name: 'Settings', value: 'settings', icon: <IoMdSettings size={18} /> };

  if (!isLogin || role !== 'rider') {
    return (
      <main className="page-wrap wrap">
        <div className="empty-state">
          <span className="empty-mark">🔒</span>
          <h2>Access Denied</h2>
          <p>Please log in with a delivery rider partner account to view this workspace.</p>
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

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'RI';

  return (
    <main className="dashboard-shell wrap">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mainTabs={mainTabs}
        settingsTab={settingsTab}
        title="Courier"
        subtitle="Delivery rider"
      />

      <section className="dashboard-content">
        <div className="dashboard-topline">
          <div>
            <p className="eyebrow">COURIER · RIDER WORKSPACE</p>
            <h1>
              {activeTab === 'overview'
                ? 'Delivery queue'
                : activeTab === 'orders'
                  ? 'Assigned orders'
                  : activeTab === 'profile'
                    ? 'Vehicle & KYC details'
                    : 'Account settings'}
            </h1>
            <p>
              View assigned pickup kitchens, navigate to customer doorsteps, and confirm delivery
              OTPs.
            </p>
          </div>
          <span className="avatar avatar-small">{initial}</span>
        </div>

        <div style={{ minWidth: 0 }}>
          {activeTab === 'overview' && <RiderOverview />}
          {activeTab === 'orders' && <RiderOrders />}
          {activeTab === 'profile' && <RiderProfileContainer />}
          {activeTab === 'settings' && <RiderSetting />}
        </div>
      </section>
    </main>
  );
};

export default RiderDashboard;

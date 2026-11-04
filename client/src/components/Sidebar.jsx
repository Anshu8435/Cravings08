import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({
  activeTab,
  setActiveTab,
  mainTabs,
  settingsTab,
  title = 'Cravings',
  subtitle = 'Dashboard',
  dropdownOptions,
  selectedDropdownValue,
  onDropdownChange,
}) => {
  const { user, role } = useAuth();
  const initial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : subtitle
      ? subtitle.charAt(0).toUpperCase()
      : 'C';

  return (
    <aside className="dashboard-sidebar">
      {/* Profile Header */}
      <div className="dashboard-profile">
        <span className="avatar">{initial}</span>
        <div>
          <strong>{user?.fullName?.split(' ')[0] || title}</strong>
          <small>{subtitle || role || 'Active workspace'}</small>
        </div>
      </div>

      {dropdownOptions && dropdownOptions.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <select
            value={selectedDropdownValue}
            onChange={(e) => onDropdownChange(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid var(--line)',
              background: 'var(--paper)',
              fontSize: '0.8rem',
              color: 'var(--ink)',
              fontFamily: 'inherit',
            }}
          >
            {dropdownOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Nav Tabs */}
      <nav
        aria-label={`${subtitle} navigation`}
        style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
      >
        {mainTabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              className={isActive ? 'is-active' : ''}
              onClick={() => setActiveTab(tab.value)}
            >
              <span className="side-mark">
                {tab.value === 'overview' ? '⌂' : tab.value.slice(0, 1).toUpperCase()}
              </span>
              {tab.name}
            </button>
          );
        })}

        {settingsTab && (
          <button
            type="button"
            className={activeTab === settingsTab.value ? 'is-active' : ''}
            onClick={() => setActiveTab(settingsTab.value)}
          >
            <span className="side-mark">⚙</span>
            {settingsTab.name}
          </button>
        )}

        <Link to="/" className="dashboard-exit" style={{ marginTop: '12px' }}>
          <span className="side-mark">↩</span>
          Back to Cravings
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;

import React, { useState, useEffect } from 'react';
import api from '../../config/ApiConfig';
import toast from 'react-hot-toast';
import {
  IoCheckmarkCircleOutline,
  IoBanOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoRestaurantOutline,
  IoLocationOutline,
  IoCallOutline,
} from 'react-icons/io5';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchRestaurants = async () => {
    try {
      const res = await api.get('/admin/restaurants');
      setRestaurants(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/restaurants/${id}/status`, { status });
      toast.success(`Restaurant status updated to ${status}`);
      fetchRestaurants();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredRestaurants = restaurants.filter((rest) => {
    const matchesSearch =
      rest.restaurantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rest.managerId?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || rest.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalRestaurants = restaurants.length;
  const pendingApprovals = restaurants.filter((r) => r.status === 'inactive').length;
  const activeRestaurants = restaurants.filter((r) => r.status === 'active').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Metric Cards */}
      <div className="metric-grid">
        <article className="metric-card">
          <span>ALL RESTAURANTS</span>
          <strong>{totalRestaurants < 10 ? `0${totalRestaurants}` : totalRestaurants}</strong>
          <small>Total registered kitchens</small>
        </article>

        <article className="metric-card">
          <span>PENDING REVIEW</span>
          <strong style={{ color: pendingApprovals > 0 ? 'var(--red)' : 'var(--ink)' }}>
            {pendingApprovals < 10 ? `0${pendingApprovals}` : pendingApprovals}
          </strong>
          <small>Awaiting onboarding verification</small>
        </article>

        <article className="metric-card">
          <span>ACTIVE NETWORK</span>
          <strong style={{ color: 'var(--green)' }}>
            {activeRestaurants < 10 ? `0${activeRestaurants}` : activeRestaurants}
          </strong>
          <small>Serving customer orders</small>
        </article>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          background: 'var(--cream)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-card)',
          padding: '14px 18px',
        }}
      >
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search kitchen name or partner…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              background: 'var(--paper)',
              fontSize: '0.85rem',
              color: 'var(--ink)',
            }}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid var(--line)',
            background: 'var(--paper)',
            fontSize: '0.85rem',
            color: 'var(--ink)',
            cursor: 'pointer',
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Pending Approval</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Restaurant List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div className="empty-state" style={{ padding: '40px' }}>
            <span className="empty-mark">⏳</span>
            <h3>Loading restaurants…</h3>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="empty-state">
            <span className="empty-mark">🍽️</span>
            <h3>No restaurants found</h3>
            <p>Try adjusting your search query or filter.</p>
          </div>
        ) : (
          filteredRestaurants.map((rest) => {
            const coverImage = rest.coverImage?.url || '/assets/bitehero-food-hero.png';
            const isPending = rest.status === 'inactive';
            const isActive = rest.status === 'active';

            return (
              <div
                key={rest._id}
                style={{
                  background: 'var(--cream)',
                  border: '1px solid var(--line)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <img
                  src={coverImage}
                  alt={rest.restaurantName}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '1px solid var(--line)',
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "'Fraunces', Georgia, serif",
                        fontSize: '1.15rem',
                        color: 'var(--ink)',
                      }}
                    >
                      {rest.restaurantName}
                    </h3>
                    <span
                      className="status-pill"
                      style={{
                        background: isActive
                          ? 'rgba(82, 108, 68, 0.12)'
                          : isPending
                            ? 'rgba(241, 190, 88, 0.2)'
                            : 'rgba(180, 58, 47, 0.12)',
                        color: isActive ? 'var(--green)' : isPending ? '#8e5e00' : 'var(--red)',
                      }}
                    >
                      {isPending ? 'Pending' : rest.status}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
                    Manager: {rest.managerId?.fullName || 'Not assigned'} ·{' '}
                    {rest.city || 'Express district'}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!isActive && (
                    <button
                      type="button"
                      className="button button-small"
                      onClick={() => handleUpdateStatus(rest._id, 'active')}
                      style={{ background: 'var(--green)', color: '#fff', fontSize: '0.78rem' }}
                    >
                      Approve Kitchen
                    </button>
                  )}
                  {isActive && (
                    <button
                      type="button"
                      className="button button-small"
                      onClick={() => handleUpdateStatus(rest._id, 'blocked')}
                      style={{ background: 'var(--red)', color: '#fff', fontSize: '0.78rem' }}
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminRestaurants;

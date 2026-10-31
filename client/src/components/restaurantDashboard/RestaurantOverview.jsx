import React from 'react';
import api from '../../config/ApiConfig';
import toast from 'react-hot-toast';
import { IoRestaurantOutline, IoLocationOutline } from 'react-icons/io5';

const RestaurantOverview = ({ activeRestaurantId, restaurants, refreshRestaurants }) => {
  const recentOrders = [
    { id: '#CR-2089', customer: 'Rahul Sharma', amount: '₹450.00', status: 'Delivered' },
    { id: '#CR-2083', customer: 'Priya Patel', amount: '₹320.50', status: 'Preparing' },
    { id: '#CR-2079', customer: 'Amit Kumar', amount: '₹180.75', status: 'Delivered' },
  ];

  const handleToggleStatus = async (restaurantId) => {
    try {
      const response = await api.patch('/restaurant/toggle-status', { restaurantId });
      if (response.data?.data) {
        if (refreshRestaurants) {
          refreshRestaurants();
        }
        toast.success(response.data.message || 'Status updated!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Metric Cards Grid */}
      <div className="metric-grid">
        <article className="metric-card">
          <span>KITCHENS ONLINE</span>
          <strong>{restaurants ? `0${restaurants.filter((r) => r.isOpen).length}` : '01'}</strong>
          <small>Accepting incoming customer orders</small>
        </article>

        <article className="metric-card">
          <span>TODAY'S ORDERS</span>
          <strong>04</strong>
          <small>Dispatched from kitchen</small>
        </article>

        <article className="metric-card">
          <span>KITCHEN REVENUE</span>
          <strong>₹1,850</strong>
          <small>Daily culinary gross</small>
        </article>
      </div>

      {/* Network Quick Controls */}
      {restaurants && restaurants.length > 0 && (
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Kitchen outlets</h2>
              <p>Manage operating availability for your kitchen locations.</p>
            </div>
            <span className="preview-note">{restaurants.length} Registered Outlets</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
            }}
          >
            {restaurants.map((rest) => {
              const coverImage = rest.coverImage?.url || '/assets/bitehero-food-hero.png';
              return (
                <div
                  key={rest._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--paper)',
                    border: '1px solid var(--line)',
                  }}
                >
                  <img
                    src={coverImage}
                    alt={rest.restaurantName}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid var(--line)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '0.92rem',
                        color: 'var(--ink)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {rest.restaurantName}
                    </strong>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--muted)',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      {rest.city || 'Express district'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(rest._id)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: rest.isOpen
                          ? '1px solid rgba(82, 108, 68, 0.4)'
                          : '1px solid rgba(180, 58, 47, 0.4)',
                        background: rest.isOpen
                          ? 'rgba(82, 108, 68, 0.12)'
                          : 'rgba(180, 58, 47, 0.12)',
                        color: rest.isOpen ? 'var(--green)' : 'var(--red)',
                      }}
                    >
                      {rest.isOpen ? '● Kitchen Open' : '○ Kitchen Closed'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Activity Table */}
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent orders</h2>
            <p>Live incoming requests from customers.</p>
          </div>
          <span className="preview-note">Order Queue</span>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.id}</strong>
                  </td>
                  <td>{row.customer}</td>
                  <td>
                    <strong>{row.amount}</strong>
                  </td>
                  <td>
                    <span
                      className="status-pill"
                      style={{
                        background:
                          row.status === 'Delivered'
                            ? 'rgba(82, 108, 68, 0.12)'
                            : 'rgba(241, 190, 88, 0.2)',
                        color: row.status === 'Delivered' ? 'var(--green)' : '#8e5e00',
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default RestaurantOverview;

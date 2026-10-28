import React, { useState, useEffect } from 'react';
import ActivePoolsWidget from './ActivePoolsWidget';
import api from '../../config/ApiConfig';
import toast from 'react-hot-toast';

const CustomerOverview = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/order/my-orders');
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch overview data');
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = orders.reduce(
    (total, order) => total + (order.billDetails?.finalAmount || 0),
    0,
  );
  const activeOrders = orders.filter(
    (o) => !['delivered', 'cancelled', 'rejected'].includes((o.orderStatus || '').toLowerCase()),
  );
  const recentOrders = orders.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Metric Cards Grid */}
      <div className="metric-grid">
        <article className="metric-card">
          <span>TOTAL ORDERS</span>
          <strong>{orders.length < 10 ? `0${orders.length}` : orders.length}</strong>
          <small>Placed with Cravings kitchens</small>
        </article>

        <article className="metric-card">
          <span>TOTAL SPENT</span>
          <strong>₹{totalSpent}</strong>
          <small>Cumulative culinary orders</small>
        </article>

        <article className="metric-card">
          <span>ACTIVE ORDERS</span>
          <strong style={{ color: activeOrders.length > 0 ? 'var(--red)' : 'var(--ink)' }}>
            {activeOrders.length < 10 ? `0${activeOrders.length}` : activeOrders.length}
          </strong>
          <small>In kitchen / on the way</small>
        </article>
      </div>

      {/* Neighborhood Pooling Widget */}
      <ActivePoolsWidget />

      {/* Recent Activity Table */}
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent orders</h2>
            <p>Your recent kitchen orders and active delivery statuses.</p>
          </div>
          <span className="preview-note">Live Account Activity</span>
        </div>

        {loading ? (
          <div className="empty-state" style={{ padding: '40px 10px' }}>
            <span className="empty-mark">⏳</span>
            <h3>Fetching orders…</h3>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Kitchen / Restaurant</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const status = (order.orderStatus || 'pending').toLowerCase();
                  return (
                    <tr key={order._id}>
                      <td>
                        <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                      </td>
                      <td>{order.restaurantId?.restaurantName || 'Curated Kitchen'}</td>
                      <td>
                        <strong>₹{order.billDetails?.finalAmount || 0}</strong>
                      </td>
                      <td>
                        <span
                          className="status-pill"
                          style={{
                            background:
                              status === 'delivered'
                                ? 'rgba(82, 108, 68, 0.12)'
                                : status === 'cancelled'
                                  ? 'rgba(180, 58, 47, 0.12)'
                                  : 'rgba(241, 190, 88, 0.2)',
                            color:
                              status === 'delivered'
                                ? 'var(--green)'
                                : status === 'cancelled'
                                  ? 'var(--red)'
                                  : '#8e5e00',
                          }}
                        >
                          {order.orderStatus || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-mark">▢</span>
            <h3>No orders placed yet</h3>
            <p>Ready for a meal? Browse curated restaurants and place your first order.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerOverview;

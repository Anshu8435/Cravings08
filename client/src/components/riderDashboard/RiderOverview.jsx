import React, { useState, useEffect } from 'react';
import api from '../../config/ApiConfig';

const RiderOverview = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get('/order/rider-orders');
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error('Order fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const totalEarnings = orders.reduce(
    (total, order) => total + (order.billDetails?.finalAmount || 0),
    0,
  );
  const completedOrders = orders.filter((o) => (o.orderStatus || '').toLowerCase() === 'delivered');
  const recentOrders = orders.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Metric Cards Grid */}
      <div className="metric-grid">
        <article className="metric-card">
          <span>ASSIGNED DELIVERIES</span>
          <strong>{orders.length < 10 ? `0${orders.length}` : orders.length}</strong>
          <small>Total deliveries dispatched</small>
        </article>

        <article className="metric-card">
          <span>COMPLETED</span>
          <strong>
            {completedOrders.length < 10 ? `0${completedOrders.length}` : completedOrders.length}
          </strong>
          <small>Verified doorstep handovers</small>
        </article>

        <article className="metric-card">
          <span>GROSS EARNINGS</span>
          <strong>₹{totalEarnings}</strong>
          <small>Calculated delivery payouts</small>
        </article>

        <article className="metric-card">
          <span>COURIER STATUS</span>
          <strong style={{ color: 'var(--green)' }}>Active</strong>
          <small>Online & ready for nearby pickups</small>
        </article>
      </div>

      {/* Deliveries Queue Table */}
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h2>Delivery queue</h2>
            <p>Active pickup and drop-off assignments for your shift.</p>
          </div>
          <span className="preview-note">Courier Telemetry</span>
        </div>

        {loading ? (
          <div className="empty-state" style={{ padding: '40px 10px' }}>
            <span className="empty-mark">⏳</span>
            <h3>Fetching delivery assignments…</h3>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Pickup Kitchen</th>
                  <th>Customer Address</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const status = (order.orderStatus || 'assigned').toLowerCase();
                  return (
                    <tr key={order._id}>
                      <td>
                        <strong>#{order._id.substring(0, 8).toUpperCase()}</strong>
                      </td>
                      <td>{order.restaurantId?.restaurantName || 'Curated Kitchen'}</td>
                      <td>{order.deliveryAddress?.city || 'Doorstep destination'}</td>
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
                                : 'rgba(241, 190, 88, 0.2)',
                            color: status === 'delivered' ? 'var(--green)' : '#8e5e00',
                          }}
                        >
                          {order.orderStatus || 'In transit'}
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
            <span className="empty-mark">🚴</span>
            <h3>No active deliveries in queue</h3>
            <p>Stay online. Nearby restaurant orders will be automatically assigned to you.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default RiderOverview;

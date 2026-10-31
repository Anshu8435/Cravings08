import React, { useState, useEffect } from 'react';
import api from '../../config/ApiConfig';

const RestaurantOrders = ({ activeRestaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeRestaurantId) {
      setIsLoading(true);
      api
        .get(`/order/restaurant-orders?restaurantId=${activeRestaurantId}`)
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.data)) {
            setOrders(
              res.data.data.map((o) => ({
                id: `#ORD-${(o._id || '').slice(-4).toUpperCase()}`,
                customer: o.customerId?.fullName || 'Customer',
                amount: `₹${o.billDetails?.finalAmount || o.billDetails?.totalAmount || 0}`,
                status: o.orderStatus
                  ? o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1)
                  : 'Pending',
                date: o.createdAt ? o.createdAt.split('T')[0] : 'Today',
              })),
            );
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [activeRestaurantId]);

  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <h2>Kitchen orders</h2>
          <p>Orders received and fulfillment status for this kitchen.</p>
        </div>
        <span className="preview-note">{orders.length} Total orders</span>
      </div>

      {isLoading ? (
        <div className="empty-state" style={{ padding: '40px 10px' }}>
          <span className="empty-mark">⏳</span>
          <h3>Loading orders…</h3>
        </div>
      ) : orders.length > 0 ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const status = (order.status || 'pending').toLowerCase();
                return (
                  <tr key={index}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>
                    <td>{order.customer}</td>
                    <td>
                      <strong>{order.amount}</strong>
                    </td>
                    <td>
                      <span
                        className="status-pill"
                        style={{
                          background:
                            status === 'delivered'
                              ? 'rgba(82, 108, 68, 0.12)'
                              : status === 'preparing'
                                ? 'rgba(241, 190, 88, 0.2)'
                                : 'rgba(180, 58, 47, 0.12)',
                          color:
                            status === 'delivered'
                              ? 'var(--green)'
                              : status === 'preparing'
                                ? '#8e5e00'
                                : 'var(--red)',
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-mark">📋</span>
          <h3>No orders received yet</h3>
          <p>Incoming orders will appear here as soon as customers order from this kitchen.</p>
        </div>
      )}
    </section>
  );
};

export default RestaurantOrders;

import React, { useState, useEffect } from 'react';
import api from '../../config/ApiConfig';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/order/admin-orders')
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setOrders(
            res.data.data.map((o) => ({
              id: `#ORD-${(o._id || '').slice(-4).toUpperCase()}`,
              restaurant: o.restaurantId?.restaurantName || 'Curated Kitchen',
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
  }, []);

  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <h2>Global platform orders</h2>
          <p>Real-time order monitoring across all partner kitchens and districts.</p>
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
                <th>Order Ref</th>
                <th>Restaurant / Kitchen</th>
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
                    <td>{order.restaurant}</td>
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
          <h3>No orders placed yet</h3>
          <p>
            Global platform orders will appear here in real-time as customer orders are created.
          </p>
        </div>
      )}
    </section>
  );
};

export default AdminOrders;

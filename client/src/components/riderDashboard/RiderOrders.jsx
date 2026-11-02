import React, { useState, useEffect } from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';
import api from '../../config/ApiConfig';
import toast from 'react-hot-toast';

const RiderOrders = () => {
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
      if (showLoading) toast.error('Failed to fetch orders');
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

  const generateMapLink = (lat, lon) => {
    if (!lat || !lon || lat === '0' || lon === '0') return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=Two-wheeler`;
  };

  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <h2>Assigned orders</h2>
          <p>Deliveries dispatched to your route.</p>
        </div>
        <span className="preview-note">{orders.length} Total orders</span>
      </div>

      {loading ? (
        <div className="empty-state" style={{ padding: '40px 10px' }}>
          <span className="empty-mark">⏳</span>
          <h3>Loading deliveries…</h3>
        </div>
      ) : orders.length > 0 ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Restaurant</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'center' }}>Navigation</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = (order.orderStatus || 'pending').toLowerCase();
                const mapLink = generateMapLink(
                  order.deliveryAddress?.geoLocation?.lat,
                  order.deliveryAddress?.geoLocation?.lon,
                );

                return (
                  <tr key={order._id}>
                    <td>
                      <strong>#{order._id.substring(0, 8).toUpperCase()}</strong>
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
                              : 'rgba(241, 190, 88, 0.2)',
                          color: status === 'delivered' ? 'var(--green)' : '#8e5e00',
                        }}
                      >
                        {order.orderStatus || 'Assigned'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {mapLink ? (
                        <a
                          href={mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button button-small"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.74rem',
                            padding: '4px 10px',
                          }}
                        >
                          <FaMapMarkedAlt /> Maps
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
                          Manual route
                        </span>
                      )}
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
          <h3>No assigned orders</h3>
          <p>New customer delivery requests will appear here when assigned to you.</p>
        </div>
      )}
    </section>
  );
};

export default RiderOrders;

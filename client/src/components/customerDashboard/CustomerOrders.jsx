import React, { useState, useEffect } from 'react';
import api from '../../config/ApiConfig';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaUtensils, FaMotorcycle, FaHome, FaTimesCircle } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get('/order/my-orders');
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      if (showLoading) toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusStep = (status) => {
    if (['pending', 'accepted'].includes(status)) return 1;
    if (['preparing', 'ready'].includes(status)) return 2;
    if (['pickedUp', 'onTheWay', 'outForDelivery'].includes(status)) return 3;
    if (['delivered'].includes(status)) return 4;
    return 0;
  };

  const renderOrderTracker = (status) => {
    const currentStep = getOrderStatusStep(status);
    const isCancelled = ['cancelled', 'failed', 'rejected', 'undeliverable'].includes(status);

    if (isCancelled) {
      return (
        <div
          style={{
            background: 'rgba(180, 58, 47, 0.08)',
            border: '1px solid rgba(180, 58, 47, 0.25)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <FaTimesCircle style={{ color: 'var(--red)', fontSize: '1.5rem' }} />
          <div>
            <h4 style={{ margin: 0, fontWeight: '700', color: 'var(--red)', fontSize: '0.92rem' }}>
              Order {status}
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
              Unfortunately, this order could not be fulfilled.
            </p>
          </div>
        </div>
      );
    }

    const steps = [
      { id: 1, label: 'Placed', icon: FaCheckCircle },
      { id: 2, label: 'Kitchen Prep', icon: FaUtensils },
      { id: 3, label: 'On The Way', icon: FaMotorcycle },
      { id: 4, label: 'Delivered', icon: FaHome },
    ];

    return (
      <div
        style={{
          background: 'var(--paper)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '18px 16px',
        }}
      >
        <h4
          style={{
            textAlign: 'center',
            fontFamily: "'Fraunces', Georgia, serif",
            margin: '0 0 16px',
            fontSize: '1.05rem',
            color: 'var(--ink)',
          }}
        >
          Live Tracking Status
        </h4>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {steps.map((step) => {
            const isCompleted = currentStep >= step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCompleted ? 'var(--red)' : 'var(--cream)',
                    border: isCompleted ? '1px solid var(--red)' : '1px solid var(--line)',
                    color: isCompleted ? '#fff' : 'var(--muted)',
                  }}
                >
                  <step.icon size={15} />
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: isCompleted ? '700' : '500',
                    color: isCompleted ? 'var(--ink)' : 'var(--muted)',
                    textAlign: 'center',
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h2>My orders</h2>
            <p>Full history and live status tracking of your food deliveries.</p>
          </div>
          <span className="preview-note">{orders.length} Total orders</span>
        </div>

        {loading ? (
          <div className="empty-state" style={{ padding: '40px 10px' }}>
            <span className="empty-mark">⏳</span>
            <h3>Loading orders…</h3>
          </div>
        ) : orders.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Restaurant</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = (order.orderStatus || 'pending').toLowerCase();
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
                      <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="button button-small"
                          onClick={() => setSelectedOrder(order)}
                          style={{ fontSize: '0.76rem', padding: '5px 12px' }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-mark">📦</span>
            <h3>No past orders found</h3>
            <p>You have not placed any orders yet. Visit Order Now to discover delicious meals.</p>
          </div>
        )}
      </section>

      {/* Order Details & Tracking Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(40, 38, 31, 0.5)',
            backdropFilter: 'blur(3px)',
            padding: '16px',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              background: 'var(--cream)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-float)',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--line)',
                paddingBottom: '14px',
                marginBottom: '18px',
              }}
            >
              <div>
                <p className="eyebrow" style={{ margin: 0 }}>
                  ORDER DETAILS
                </p>
                <h3
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.35rem',
                    margin: 0,
                    color: 'var(--ink)',
                  }}
                >
                  #{selectedOrder._id.substring(0, 8).toUpperCase()}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                }}
              >
                <IoCloseOutline size={26} />
              </button>
            </div>

            {/* Info Breakdown */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.86rem',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Restaurant:</span>
                <strong>{selectedOrder.restaurantId?.restaurantName || 'Curated Kitchen'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Delivery address:</span>
                <span>{selectedOrder.deliveryAddress?.street || 'Doorstep delivery'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Payment:</span>
                <span style={{ textTransform: 'uppercase', fontWeight: '600' }}>
                  {selectedOrder.paymentMethod || 'Online'}
                </span>
              </div>
            </div>

            {/* Live Tracking Visual */}
            <div style={{ marginBottom: '18px' }}>
              {renderOrderTracker(selectedOrder.orderStatus)}
            </div>

            {/* Order Items */}
            <div
              style={{
                borderTop: '1px solid var(--line)',
                paddingTop: '14px',
                marginBottom: '16px',
              }}
            >
              <h4
                style={{
                  margin: '0 0 10px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  color: 'var(--ink)',
                }}
              >
                Ordered Items
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.84rem',
                      borderBottom: '1px dashed var(--line)',
                      paddingBottom: '6px',
                    }}
                  >
                    <span>
                      {item.quantity} × {item.itemId?.itemName || 'Dish item'}
                    </span>
                    <strong>₹{(item.itemId?.price || 0) * item.quantity}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--line)',
                paddingTop: '14px',
                marginBottom: '18px',
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--ink)' }}>
                Total Amount
              </span>
              <strong
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.4rem',
                  color: 'var(--red)',
                }}
              >
                ₹{selectedOrder.billDetails?.finalAmount || 0}
              </strong>
            </div>

            <button
              type="button"
              className="button button-primary button-wide"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;

import React from 'react';

const AdminOverview = () => {
  const recentOrders = [
    { id: '#CR-2089', restaurant: 'The Spice Route', amount: '₹450.00', status: 'Delivered' },
    { id: '#CR-2083', restaurant: 'Urban Burger Club', amount: '₹320.50', status: 'Preparing' },
    { id: '#CR-2079', restaurant: 'La Trattoria Italiana', amount: '₹180.75', status: 'Delivered' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Metric Cards Grid */}
      <div className="metric-grid">
        <article className="metric-card">
          <span>PLATFORM ORDERS</span>
          <strong>1,245</strong>
          <small>Global orders completed</small>
        </article>

        <article className="metric-card">
          <span>GROSS REVENUE</span>
          <strong>₹45,240</strong>
          <small>Platform transaction volume</small>
        </article>

        <article className="metric-card">
          <span>VERIFIED KITCHENS</span>
          <strong>24</strong>
          <small>Active FSSAI compliant outlets</small>
        </article>

        <article className="metric-card">
          <span>SYSTEM HEALTH</span>
          <strong style={{ color: 'var(--green)' }}>100%</strong>
          <small>All microservices operational</small>
        </article>
      </div>

      {/* Recent Orders Table */}
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent platform activity</h2>
            <p>Real-time orders processed through Cravings network.</p>
          </div>
          <span className="preview-note">Global Telemetry</span>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Restaurant / Kitchen</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
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
                          order.status === 'Delivered'
                            ? 'rgba(82, 108, 68, 0.12)'
                            : 'rgba(241, 190, 88, 0.2)',
                        color: order.status === 'Delivered' ? 'var(--green)' : '#8e5e00',
                      }}
                    >
                      {order.status}
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

export default AdminOverview;

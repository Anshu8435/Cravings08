import React, { useState, useEffect } from 'react';
import api from '../../config/ApiConfig';
import NoDataFound from '../NoDataFound';

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
              restaurant: o.restaurantId?.restaurantName || 'Restaurant',
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
    <div className="overflow-y-auto h-full">
      <h2 className="text-2xl font-bold mb-6">All Platform Orders</h2>
      <div className="bg-(--color-base-200) p-4 rounded-lg">
        {orders.length === 0 && !isLoading ? (
          <NoDataFound text="No orders placed on the platform yet." height="200px" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--color-secondary)">
                <th className="text-left py-2">Order ID</th>
                <th className="text-left py-2">Restaurant</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b border-(--color-secondary) hover:bg-(--color-base-100) transition-colors"
                >
                  <td className="py-3">{order.id}</td>
                  <td className="py-3">{order.restaurant}</td>
                  <td className="py-3 font-semibold">{order.amount}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Preparing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

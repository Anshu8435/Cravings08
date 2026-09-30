import React, { useState, useEffect } from 'react';
import api from '../../config/ApiConfig';
import NoDataFound from '../NoDataFound';

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
    <div className="overflow-y-auto h-full p-2 sm:p-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
        Orders Management
      </h2>
      <div className="bg-(--color-base-200) p-4 rounded-xl shadow-sm border border-(--color-base-300)">
        {orders.length === 0 && !isLoading ? (
          <NoDataFound text="No orders received for this restaurant yet." height="200px" />
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-(--color-secondary)">
                    <th className="text-left py-2 px-2">Order ID</th>
                    <th className="text-left py-2 px-2">Customer</th>
                    <th className="text-left py-2 px-2">Amount</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-left py-2 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={index}
                      className="border-b border-(--color-secondary) hover:bg-(--color-base-100) transition-colors"
                    >
                      <td className="py-3 px-2 font-semibold text-gray-800 dark:text-gray-200">
                        {order.id}
                      </td>
                      <td className="py-3 px-2">{order.customer}</td>
                      <td className="py-3 px-2 font-bold">{order.amount}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold border ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : order.status === 'Preparing'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden flex flex-col gap-4">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-black/40 p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                        {order.id}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">{order.date}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm border uppercase tracking-wide ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : order.status === 'Preparing'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {order.customer}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-gray-100 dark:border-gray-800 pt-2">
                    <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                    <span className="font-extrabold text-base text-gray-900 dark:text-gray-100">
                      {order.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantOrders;

import React, { useState, useEffect } from "react";
import ActivePoolsWidget from "./ActivePoolsWidget";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";

const CustomerOverview = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/order/my-orders");
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch overview data");
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = orders.reduce((total, order) => total + (order.billDetails?.finalAmount || 0), 0);
  const recentOrders = orders.slice(0, 3); // Get top 3 most recent

  return (
    <div className="overflow-y-auto h-full pr-2">
      <h2 className="text-2xl font-bold mb-6">Customer Overview</h2>
      
      {/* Neighborhood Pooling Widget */}
      <ActivePoolsWidget />

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-700/50 flex flex-col justify-center relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-100 dark:bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mb-1 relative z-10">Total Orders</p>
              <p className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white relative z-10">{orders.length}</p>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-700/50 flex flex-col justify-center relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-orange-100 dark:bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mb-1 relative z-10">Total Spent</p>
              <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 dark:from-orange-400 dark:to-orange-300 relative z-10">₹{totalSpent}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white/95 to-white/70 dark:from-gray-900/95 dark:to-gray-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/40 dark:border-gray-700/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
            <h3 className="font-extrabold text-xl mb-6 relative z-10 text-gray-900 dark:text-white">Recent Orders</h3>
            <div className="overflow-x-auto relative z-10">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50/80 to-transparent dark:from-gray-800/80 border-b border-gray-200/60 dark:border-gray-700/60 text-gray-500 dark:text-gray-400 uppercase text-xs tracking-widest font-bold">
                    <th className="text-left py-4 px-6 rounded-tl-xl">Order ID</th>
                    <th className="text-left py-4 px-6">Restaurant</th>
                    <th className="text-left py-4 px-6">Amount</th>
                    <th className="text-left py-4 px-6 rounded-tr-xl">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100/60 dark:border-gray-800/60 hover:bg-gradient-to-r hover:from-orange-50/80 hover:to-transparent dark:hover:from-orange-900/10 transition-all duration-300 group last:border-0">
                        <td className="py-4 px-6 font-extrabold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          #{order._id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                          {order.restaurantId?.restaurantName || "Unknown"}
                        </td>
                        <td className="py-4 px-6 font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 dark:from-orange-400 dark:to-orange-300">
                          ₹{order.billDetails?.finalAmount || 0}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black border capitalize shadow-sm transition-all duration-300 ${
                            order.orderStatus === "delivered" ? "bg-green-50/80 text-green-700 border-green-200/50 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 shadow-green-500/10" :
                            order.orderStatus === "pending" || order.orderStatus === "preparing" ? "bg-yellow-50/80 text-yellow-700 border-yellow-200/50 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20 shadow-yellow-500/10" :
                            "bg-red-50/80 text-red-700 border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 shadow-red-500/10"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              order.orderStatus === "delivered" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" :
                              order.orderStatus === "pending" || order.orderStatus === "preparing" ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" :
                              "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                            }`}></span>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-sm font-bold text-gray-400 dark:text-gray-500 italic bg-gray-50/50 dark:bg-gray-800/30 rounded-b-xl border border-dashed border-gray-200 dark:border-gray-700/50">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerOverview;

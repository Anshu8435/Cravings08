import React, { useState, useEffect } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";

const RiderOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get("/order/rider-orders");
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Order fetch error:", error.response?.data || error);
      if (showLoading) toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const generateMapLink = (lat, lon) => {
    if (!lat || !lon || lat === "0" || lon === "0") return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=Two-wheeler`;
  };

  return (
    <div className="overflow-y-auto h-full">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <div className="bg-gradient-to-br from-white/95 to-white/70 dark:from-gray-900/95 dark:to-gray-800/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/40 dark:border-gray-700/50 rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="w-full text-sm sm:text-base relative z-10">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50/80 to-transparent dark:from-gray-800/80 border-b border-gray-200/60 dark:border-gray-700/60 text-gray-500 dark:text-gray-400 uppercase text-xs tracking-widest font-bold">
                <th className="text-left py-5 px-8">Order ID</th>
                <th className="text-left py-5 px-6">Restaurant</th>
                <th className="text-left py-5 px-6">Amount</th>
                <th className="text-left py-5 px-6">Status</th>
                <th className="text-left py-5 px-6">Date</th>
                <th className="text-center py-5 px-8">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100/60 dark:border-gray-800/60 hover:bg-gradient-to-r hover:from-orange-50/80 hover:to-transparent dark:hover:from-orange-900/10 transition-all duration-300 group">
                    <td className="py-5 px-8 font-extrabold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      #{order._id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="py-5 px-6 font-semibold text-gray-700 dark:text-gray-300">
                      {order.restaurantId?.restaurantName || "Unknown"}
                    </td>
                    <td className="py-5 px-6 font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 dark:from-orange-400 dark:to-orange-300">
                      ₹{order.billDetails?.finalAmount || 0}
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black border capitalize shadow-sm transition-all duration-300 ${
                        order.orderStatus === "delivered" ? "bg-green-50/80 text-green-700 border-green-200/50 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 shadow-green-500/10" :
                        order.orderStatus === "pending" || order.orderStatus === "preparing" ? "bg-yellow-50/80 text-yellow-700 border-yellow-200/50 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20 shadow-yellow-500/10" :
                        "bg-red-50/80 text-red-700 border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 shadow-red-500/10"
                      }`}>
                        <span className={`w-2 h-2 rounded-full animate-pulse ${
                          order.orderStatus === "delivered" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" :
                          order.orderStatus === "pending" || order.orderStatus === "preparing" ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" :
                          "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                        }`}></span>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-gray-500 dark:text-gray-400 font-semibold text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-8 text-center">
                      {generateMapLink(order.deliveryAddress?.geoLocation?.lat, order.deliveryAddress?.geoLocation?.lon) ? (
                        <a
                          href={generateMapLink(order.deliveryAddress?.geoLocation?.lat, order.deliveryAddress?.geoLocation?.lon)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative overflow-hidden bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400 group/btn flex items-center justify-center gap-2 inline-flex"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            <FaMapMarkedAlt className="text-lg" />
                            Navigate
                          </span>
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-100/50 to-orange-50/50 dark:from-orange-500/10 dark:to-transparent translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300"></div>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold italic bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50 block w-max mx-auto">No Location Data</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-(--color-secondary)">
                  <td
                    colSpan="6"
                    className="text-center py-8 text-(--color-neutral) font-medium"
                  >
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-5 p-2 pb-5">
          {loading && orders.length === 0 ? (
             <div className="flex justify-center items-center h-32">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
             </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/90 dark:to-gray-800/80 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/60 dark:border-gray-700/60 flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>

                <div className="flex justify-between items-start border-b border-gray-100/80 dark:border-gray-700/50 pb-4 relative z-10">
                  <div>
                    <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      #{order._id.substring(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black shadow-sm border uppercase tracking-widest ${
                    order.orderStatus === "delivered" ? "bg-green-50/80 text-green-700 border-green-200/50 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" :
                    order.orderStatus === "pending" || order.orderStatus === "preparing" ? "bg-yellow-50/80 text-yellow-700 border-yellow-200/50 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20" :
                    "bg-red-50/80 text-red-700 border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      order.orderStatus === "delivered" ? "bg-green-500" :
                      order.orderStatus === "pending" || order.orderStatus === "preparing" ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}></span>
                    {order.orderStatus}
                  </span>
                </div>
                
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Restaurant</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{order.restaurantId?.restaurantName || "Unknown"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">Amount</p>
                    <p className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 dark:from-orange-400 dark:to-orange-300">₹{order.billDetails?.finalAmount || 0}</p>
                  </div>
                </div>

                <div className="pt-2 relative z-10">
                  {generateMapLink(order.deliveryAddress?.geoLocation?.lat, order.deliveryAddress?.geoLocation?.lon) ? (
                    <a
                      href={generateMapLink(order.deliveryAddress?.geoLocation?.lat, order.deliveryAddress?.geoLocation?.lon)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-2 relative overflow-hidden bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-500/30 py-3 rounded-xl text-sm font-black transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 group/btn flex items-center justify-center gap-2"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <FaMapMarkedAlt className="text-lg" /> Navigate to Customer
                      </span>
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-100/80 to-orange-50/50 dark:from-orange-500/20 dark:to-transparent translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300"></div>
                    </a>
                  ) : (
                    <div className="w-full text-center text-gray-400 dark:text-gray-500 py-3 text-sm font-semibold italic border border-dashed rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                      Location data unavailable
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 font-semibold bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              No orders yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderOrders;

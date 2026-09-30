import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaMoneyBillWave, FaRoute, FaStar } from "react-icons/fa";
import { MdTimeline } from "react-icons/md";
import { BiTrendingUp } from "react-icons/bi";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";

const RiderOverview = () => {
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
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real orders
  const totalEarnings = orders.reduce((total, order) => total + (order.billDetails?.finalAmount || 0), 0);
  const recentOrders = orders.slice(0, 3); // Get top 3 most recent
  return (
    <div className="overflow-y-auto h-full px-2 pb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 dark:from-orange-400 dark:to-orange-300 drop-shadow-sm">
            Rider Overview
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium mt-1">
            Welcome back! Here's your performance at a glance.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 bg-white/80 dark:bg-black/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-inner border border-white/20">
          <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-600"></span>
          </span>
          <span className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-500">Online & Accepting Orders</span>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-(--color-neutral) text-sm font-semibold tracking-wide uppercase mb-1">Total Orders</p>
              <p className="text-4xl font-black text-gray-800 dark:text-white">{orders.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl shadow-inner">
              <FaShoppingCart size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-green-500">
            <BiTrendingUp className="mr-1" size={18} />
            <span>+12% this week</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-(--color-neutral) text-sm font-semibold tracking-wide uppercase mb-1">Total Earnings</p>
              <p className="text-4xl font-black text-gray-800 dark:text-white">₹{totalEarnings}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl shadow-inner">
              <FaMoneyBillWave size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-green-500">
            <BiTrendingUp className="mr-1" size={18} />
            <span>+₹240 this week</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-(--color-neutral) text-sm font-semibold tracking-wide uppercase mb-1">Total Distance</p>
              <p className="text-4xl font-black text-gray-800 dark:text-white">452 <span className="text-xl font-bold text-gray-500">km</span></p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl shadow-inner">
              <FaRoute size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            <MdTimeline className="mr-1" size={18} />
            <span>Avg 3.6 km/order</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden lg:col-span-1 md:col-span-2">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-(--color-neutral) text-sm font-semibold tracking-wide uppercase mb-1">Rider Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-4xl font-black text-gray-800 dark:text-white">4.9</p>
                <div className="flex text-yellow-400 drop-shadow-md">
                  <FaStar size={20} />
                </div>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-2xl shadow-inner">
              <FaStar size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            <span>Based on 98 reviews</span>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/95 to-white/70 dark:from-gray-900/95 dark:to-gray-800/80 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/40 dark:border-gray-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-400 opacity-50"></div>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Orders</h3>
            <button className="text-sm font-semibold text-(--color-primary) hover:text-(--color-primary-focus) transition-colors hover:underline">
              View All
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {loading && orders.length === 0 ? (
               <div className="flex justify-center items-center h-24">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
               </div>
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div key={order._id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-orange-200 dark:hover:border-orange-500/30 shadow-sm hover:shadow-md cursor-pointer relative z-10 gap-3 sm:gap-0">
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center shadow-inner font-bold text-base sm:text-lg
                      ${index === 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' : 
                        index === 1 ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 
                        'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'}
                    `}>
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100 truncate">Order #{order._id.substring(0, 8).toUpperCase()}</h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">{order.restaurantId?.restaurantName || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto shrink-0 pl-[52px] sm:pl-2 flex sm:block items-center justify-between sm:justify-start">
                    <p className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100 order-2 sm:order-1">₹{order.billDetails?.finalAmount || 0}</p>
                    <p className={`text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full sm:mt-1 inline-block capitalize order-1 sm:order-2
                      ${order.orderStatus === "delivered" ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 
                        order.orderStatus === "pending" || order.orderStatus === "preparing" ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}
                    `}>
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 font-semibold text-sm">
                No recent orders found.
              </div>
            )}
          </div>
        </div>

        {/* Notice Board */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-3xl shadow-[0_8px_30px_rgba(249,115,22,0.3)] dark:shadow-[0_8px_30px_rgba(249,115,22,0.15)] text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full blur-xl -ml-8 -mb-8 group-hover:scale-150 transition-transform duration-1000"></div>
          
          <h3 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
            <span className="text-2xl">📢</span> Announcements
          </h3>
          
          <div className="space-y-4 relative z-10">
            <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-black/30 transition-colors cursor-pointer">
              <h4 className="font-bold text-sm mb-1 text-yellow-200">Weekend Bonus!</h4>
              <p className="text-xs text-white/90 leading-relaxed">
                Complete 20 deliveries this weekend and earn an extra ₹5000 bonus. Stay safe on the roads!
              </p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-black/30 transition-colors cursor-pointer">
              <h4 className="font-bold text-sm mb-1 text-blue-200">App Update</h4>
              <p className="text-xs text-white/90 leading-relaxed">
                New navigation features have been added to the rider app. Please update to version 2.4.
              </p>
            </div>
          </div>
          
          <button className="mt-6 w-full py-3 bg-white text-orange-600 font-bold rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300 relative z-10">
            View All Updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiderOverview;

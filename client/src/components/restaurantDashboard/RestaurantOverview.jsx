import React from "react";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import { IoRestaurantOutline, IoLocationOutline } from "react-icons/io5";

const RestaurantOverview = ({ activeRestaurantId, restaurants, refreshRestaurants }) => {
  const recentOrders = [
    { id: "#ORD-1001", customer: "Rahul Sharma", amount: "₹450.00", status: "Delivered" },
    { id: "#ORD-1002", customer: "Priya Patel", amount: "₹320.50", status: "Preparing" },
    { id: "#ORD-1003", customer: "Amit Kumar", amount: "₹180.75", status: "Delivered" }
  ];

  const handleToggleStatus = async (restaurantId, currentStatus) => {
    try {
      const response = await api.patch("/restaurant/toggle-status", { restaurantId });
      if (response.data?.data) {
        if (refreshRestaurants) {
          refreshRestaurants();
        }
        toast.success(response.data.message || "Status updated!");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="overflow-y-auto h-full space-y-8 pb-10">
      
      {/* Overview Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-500 font-medium">Get a quick glance at your restaurant operations</p>
      </div>

      {/* Network Quick Controls - This shows ALL restaurants for this manager */}
      {restaurants && restaurants.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <IoRestaurantOutline className="text-[#c2410c]" size={22} />
            My Restaurant Network
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((rest) => {
              const coverImage = rest.coverImage?.url || "https://placehold.co/100x100?text=Food";
              return (
                <div key={rest._id} className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <img src={coverImage} alt={rest.restaurantName} className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{rest.restaurantName}</h4>
                    <p className="text-xs text-gray-500 truncate flex items-center gap-1 mb-2">
                      <IoLocationOutline /> {rest.city}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${rest.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                        {rest.isOpen ? 'Online' : 'Offline'}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={rest.isOpen || false} 
                          onChange={() => handleToggleStatus(rest._id, rest.isOpen)} 
                        />
                        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Orders</p>
          <p className="text-4xl font-black text-gray-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Sales</p>
          <p className="text-4xl font-black text-[#c2410c]">₹4,400.00</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Recent Orders</h3>
        
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 rounded-t-lg">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{order.id}</td>
                  <td className="px-4 py-3 text-gray-700">{order.customer}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{order.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      order.status === "Delivered" ? "bg-green-100 text-green-700 border border-green-200" :
                      order.status === "Preparing" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                      "bg-red-100 text-red-700 border border-red-200"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden flex flex-col gap-3">
          {recentOrders.map((order, index) => (
            <div key={index} className="border border-gray-100 rounded-xl p-3 shadow-sm bg-gray-50/30">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
                <span className="font-bold text-gray-900">{order.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  order.status === "Delivered" ? "bg-green-100 text-green-700 border border-green-200" :
                  order.status === "Preparing" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                  "bg-red-100 text-red-700 border border-red-200"
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Customer</p>
                  <p className="font-medium text-sm text-gray-800">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Amount</p>
                  <p className="font-bold text-[#c2410c]">{order.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantOverview;

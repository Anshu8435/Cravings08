import React, { useState, useEffect } from "react";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import { 
  IoCheckmarkCircleOutline, 
  IoBanOutline, 
  IoSearchOutline, 
  IoFilterOutline, 
  IoRestaurantOutline,
  IoLocationOutline,
  IoCallOutline,
  IoTimeOutline
} from "react-icons/io5";

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchRestaurants = async () => {
    try {
      const res = await api.get("/admin/restaurants");
      setRestaurants(res.data.data);
    } catch (error) {
      console.error("Admin fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/restaurants/${id}/status`, { status });
      toast.success(`Restaurant status updated to ${status}`);
      fetchRestaurants();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredRestaurants = restaurants.filter(rest => {
    const matchesSearch = rest.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (rest.managerId?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || rest.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate Quick Stats
  const totalRestaurants = restaurants.length;
  const pendingApprovals = restaurants.filter(r => r.status === "inactive").length;
  const activeRestaurants = restaurants.filter(r => r.status === "active").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-t-2 border-[#c2410c] animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-orange-400 animate-spin flex items-center justify-center">
            <IoRestaurantOutline className="text-[#c2410c] animate-pulse" size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-orange-50/30 to-white p-4 md:p-8 rounded-3xl">
      
      {/* Top Header & Stats */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#c2410c] to-orange-500 tracking-tight">
              Restaurant Hub
            </h1>
            <p className="text-gray-500 font-medium mt-2">Manage partners, approve listings, and monitor network.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-[#c2410c] flex items-center justify-center">
                <IoRestaurantOutline size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total</p>
                <p className="text-xl font-black text-gray-800">{totalRestaurants}</p>
              </div>
            </div>
            
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-yellow-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                <IoTimeOutline size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pending</p>
                <p className="text-xl font-black text-gray-800">{pendingApprovals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-white flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2410c]" size={22} />
            <input 
              type="text" 
              placeholder="Search by restaurant or manager name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] transition-all font-medium text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="relative md:w-64">
            <IoFilterOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2410c]" size={22} />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] transition-all font-bold text-gray-700 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Network</option>
              <option value="inactive">Pending Approval</option>
              <option value="blocked">Blocked/Rejected</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Restaurant List (Modern Cards) */}
      <div className="space-y-4">
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center border border-dashed border-gray-300">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <IoRestaurantOutline size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No Restaurants Found</h3>
            <p className="text-gray-500 mt-2 font-medium">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          filteredRestaurants.map((rest) => {
            const coverImage = rest.coverImage?.url || "https://placehold.co/400x300?text=Food";
            const isPending = rest.status === "inactive";
            
            return (
              <div 
                key={rest._id} 
                className="group bg-white p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-xl border border-transparent hover:border-orange-100 transition-all duration-300 flex flex-col md:flex-row gap-6 items-center relative overflow-hidden"
              >
                {/* Status Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  rest.status === "active" ? "bg-green-500" :
                  rest.status === "blocked" ? "bg-red-500" :
                  "bg-yellow-500"
                }`}></div>

                {/* Image */}
                <div className="w-full md:w-48 h-40 md:h-32 shrink-0 rounded-xl overflow-hidden relative shadow-inner">
                  <img src={coverImage} alt={rest.restaurantName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Floating Status Badge on Image */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-sm backdrop-blur-sm ${
                      rest.status === "active" ? "bg-green-500/90" :
                      rest.status === "blocked" ? "bg-red-500/90" :
                      "bg-yellow-500/90"
                    }`}>
                      {isPending ? "Pending" : rest.status}
                    </span>
                  </div>
                </div>

                {/* Info Content */}
                <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                  {/* Primary Info */}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{rest.restaurantName}</h3>
                      {rest.isOpen && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" title="Currently Open"></span>}
                    </div>
                    
                    <p className="text-[#c2410c] font-semibold text-sm capitalize mb-3">
                      {rest.cuisineTypes?.join(" • ") || "Various Cuisines"}
                    </p>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1.5">
                      <IoLocationOutline className="text-gray-400 shrink-0" size={16} />
                      <span className="line-clamp-1">{rest.address}, {rest.city}</span>
                    </div>
                  </div>

                  {/* Manager Details */}
                  <div className="flex flex-col justify-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Manager Details</h4>
                    
                    <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-1.5">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-[#c2410c] flex items-center justify-center text-xs">
                        {rest.managerId?.fullName?.charAt(0) || "U"}
                      </div>
                      <span className="truncate">{rest.managerId?.fullName || "Not Assigned"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <IoCallOutline className="text-gray-400" size={14} />
                      <span>{rest.contactDetails?.phone || "No Phone"}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0 justify-end md:justify-center">
                  {rest.status !== "active" && (
                    <button
                      onClick={() => handleUpdateStatus(rest._id, "active")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 transition-all font-bold text-sm"
                    >
                      <IoCheckmarkCircleOutline size={18} />
                      Approve
                    </button>
                  )}
                  {rest.status !== "blocked" && (
                    <button
                      onClick={() => handleUpdateStatus(rest._id, "blocked")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-red-500 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all font-bold text-sm"
                    >
                      <IoBanOutline size={18} />
                      Block
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminRestaurants;

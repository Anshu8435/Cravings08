import React, { useState, useEffect } from 'react';
import { FaFire, FaUsers, FaMotorcycle } from 'react-icons/fa';
import api from '../../config/ApiConfig';
import toast from 'react-hot-toast';

const ActivePoolsWidget = () => {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);

  // For simulation, hardcoding a generic coordinate representing a neighborhood
  const simulatedLat = 28.7041;
  const simulatedLon = 77.1025;

  useEffect(() => {
    fetchActivePools();
    // Refresh every 30 seconds
    const interval = setInterval(fetchActivePools, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivePools = async () => {
    try {
      const { data } = await api.get(`/pools/active?lat=${simulatedLat}&lon=${simulatedLon}`);
      
      // Update pools, assigning a countdown timer for each
      const now = new Date().getTime();
      const activePools = (data.data || []).map(pool => {
        const expiry = new Date(pool.expiresAt).getTime();
        const timeLeft = Math.max(0, Math.floor((expiry - now) / 1000));
        return { ...pool, timeLeft };
      });
      
      setPools(activePools);
    } catch (error) {
      console.error('Failed to fetch active pools', error);
    } finally {
      setLoading(false);
    }
  };

  // Timer logic for countdown
  useEffect(() => {
    if (pools.length === 0) return;

    const timer = setInterval(() => {
      setPools(prevPools => 
        prevPools.map(pool => ({
          ...pool,
          timeLeft: Math.max(0, pool.timeLeft - 1)
        })).filter(pool => pool.timeLeft > 0)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [pools.length]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleJoinPool = (poolId) => {
    toast.success("Joined neighborhood pool! Delivery fee waived on checkout.");
  };

  if (loading) return null; // Don't show anything while loading initially

  if (pools.length === 0) {
    return (
      <div className="bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 flex items-center justify-between shadow-inner mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-gray-300 dark:bg-gray-700 p-3 rounded-full text-gray-500 dark:text-gray-400">
            <FaUsers size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Neighborhood Pooling</h3>
            <p className="text-sm text-gray-500">No active pools nearby. Start an order to create one!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 animate-in slide-in-from-top-4 fade-in duration-500">
      <h3 className="text-xl font-extrabold mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
        <FaFire className="text-orange-500 animate-pulse" /> Trending Near You
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {pools.map(pool => (
          <div key={pool._id} className="relative overflow-hidden bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-5 shadow-lg border border-orange-200 dark:border-orange-800/50">
            {/* Background design elements */}
            <div className="absolute -right-4 -top-4 opacity-10">
              <FaMotorcycle size={100} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                  {pool.restaurantId?.restaurantName || "Local Restaurant"}
                </h4>
                <div className="bg-white dark:bg-gray-800 text-red-500 font-mono font-bold px-3 py-1 rounded-full text-sm shadow-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  {formatTime(pool.timeLeft)}
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                <strong className="text-orange-600 dark:text-orange-400">{pool.participants.length} neighbor{pool.participants.length !== 1 ? 's' : ''}</strong> {pool.participants.length === 1 ? 'is' : 'are'} ordering right now!
              </p>
              
              <button 
                onClick={() => handleJoinPool(pool._id)}
                className="w-full bg-linear-to-r from-(--color-primary) to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Join Pool & Get FREE Delivery
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivePoolsWidget;

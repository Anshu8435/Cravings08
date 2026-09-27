import React from "react";

const AdminOverview = () => {
  const recentOrders = [
    { id: "#ORD-1001", restaurant: "Burger King", amount: "₹45.00", status: "Delivered" },
    { id: "#ORD-1002", restaurant: "Pizza Hut", amount: "₹32.50", status: "Preparing" },
    { id: "#ORD-1003", restaurant: "KFC", amount: "₹18.75", status: "Delivered" }
  ];

  return (
    <div className="overflow-y-auto h-full">
      <h2 className="text-2xl font-bold mb-6">Admin Overview</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-(--color-base-200) p-4 rounded-lg">
          <p className="text-(--color-neutral) text-sm">Total Orders (Platform)</p>
          <p className="text-3xl font-bold">1,245</p>
        </div>
        <div className="bg-(--color-base-200) p-4 rounded-lg">
          <p className="text-(--color-neutral) text-sm">Total Revenue (Platform)</p>
          <p className="text-3xl font-bold">₹45,240.00</p>
        </div>
      </div>
      <div className="bg-(--color-base-200) p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Recent Orders</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--color-secondary)">
              <th className="text-left py-2 text-sm text-(--color-neutral)">Order ID</th>
              <th className="text-left py-2 text-sm text-(--color-neutral)">Restaurant</th>
              <th className="text-left py-2 text-sm text-(--color-neutral)">Amount</th>
              <th className="text-left py-2 text-sm text-(--color-neutral)">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={index} className="border-b border-(--color-secondary) last:border-0 hover:bg-(--color-base-100) transition-colors">
                <td className="py-2 text-sm">{order.id}</td>
                <td className="py-2 text-sm">{order.restaurant}</td>
                <td className="py-2 text-sm font-semibold">{order.amount}</td>
                <td className="py-2 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    order.status === "Delivered" ? "bg-green-100 text-green-800" :
                    order.status === "Preparing" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOverview;

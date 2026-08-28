import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";
import Menu from "../models/menu.model.js"; // Assume menu model exists

export const createOrder = async (req, res, next) => {
  try {
    const { restaurantId, paymentMethod, orderItems, geoLocation } = req.body;
    const userId = req.user._id; // from AuthProtect

    let customer = await Customer.findOne({ customerId: userId });
    if (!customer) {
      // Create a default customer profile on the fly if it doesn't exist
      customer = await Customer.create({ customerId: userId });
    }

    // In a real app you'd fetch item prices to calculate final amount safely.
    // For this demonstration, we'll calculate a mock amount based on req data if prices aren't here
    // But since the frontend passes totalAmount in Navbar, let's accept totalAmount from body just for now to not break the flow.
    const { amount } = req.body; 

    // Create a new order
    const newOrder = new Order({
      restaurantId,
      customerId: customer._id,
      orderItems,
      billDetails: {
        totalAmount: amount || 0,
        platformFee: 0,
        convenienceFee: 0,
        taxAmount: 0,
        deliveryCharge: 0,
        discountAmount: 0,
        finalAmount: amount || 0,
      },
      deliveryAddress: {
         name: "Demo", address: "Demo", city: "Demo", state: "Demo", pinCode: "000", country: "Demo",
         geoLocation: geoLocation || { lat: "0", lon: "0" }
      },
      paymentDetails: {
        paymentMethod: paymentMethod || "upi",
        paymentStatus: "pending"
      }
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let customer = await Customer.findOne({ customerId: userId });
    if (!customer) {
      customer = await Customer.create({ customerId: userId });
    }

    let orders = await Order.find({ customerId: customer._id })
      .populate("restaurantId", "restaurantName email phone")
      .sort({ createdAt: -1 });

    const now = new Date();

    // Auto-simulation for demonstration purposes
    for (let order of orders) {
      if (['pending', 'accepted', 'preparing', 'ready', 'pickedUp', 'onTheWay', 'outForDelivery'].includes(order.orderStatus)) {
        const diffMinutes = (now - new Date(order.createdAt)) / 1000 / 60;
        let newStatus = order.orderStatus;
        
        // Fast-forward through states based on minutes since order was created
        if (diffMinutes > 4) newStatus = "delivered";
        else if (diffMinutes > 3) newStatus = "outForDelivery";
        else if (diffMinutes > 2) newStatus = "preparing";
        else if (diffMinutes > 0 && order.orderStatus === 'pending') newStatus = "accepted";
        
        if (newStatus !== order.orderStatus) {
          order.orderStatus = newStatus;
          await order.save();
        }
      }
    }

    // Convert to plain objects after saves to attach menu items
    orders = orders.map(o => o.toObject());

    // Manually populate order items since menuItem is a subdocument inside Menu
    for (let order of orders) {
      if (order.restaurantId && order.restaurantId._id) {
        const menu = await Menu.findOne({ restaurantId: order.restaurantId._id });
        if (menu && menu.menuItems) {
          order.orderItems = order.orderItems.map((orderItem) => {
            const menuItemDetails = menu.menuItems.find(
              (mi) => mi._id.toString() === orderItem.itemId.toString()
            );
            return {
              ...orderItem,
              itemId: menuItemDetails || orderItem.itemId,
            };
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    next(error);
  }
};

export const getAllOrdersForRider = async (req, res, next) => {
  try {
    // In a real app, you might filter by rider location, active status, etc.
    // For this demo, we'll fetch all orders that are not pending/cancelled
    let orders = await Order.find({ 
      orderStatus: { $in: ["accepted", "preparing", "ready", "pickedUp", "onTheWay", "outForDelivery", "delivered"] } 
    })
      .populate("restaurantId", "restaurantName email phone")
      .populate("customerId", "customerId") 
      .sort({ createdAt: -1 });

    const now = new Date();

    // Re-use simulation logic so rider dashboard sees the same progress
    for (let order of orders) {
      if (['accepted', 'preparing', 'ready', 'pickedUp', 'onTheWay', 'outForDelivery'].includes(order.orderStatus)) {
        const diffMinutes = (now - new Date(order.createdAt)) / 1000 / 60;
        let newStatus = order.orderStatus;
        
        if (diffMinutes > 4) newStatus = "delivered";
        else if (diffMinutes > 3) newStatus = "outForDelivery";
        else if (diffMinutes > 2) newStatus = "preparing";
        else if (diffMinutes > 0 && order.orderStatus === 'pending') newStatus = "accepted";
        
        if (newStatus !== order.orderStatus) {
          order.orderStatus = newStatus;
          await order.save();
        }
      }
    }

    orders = orders.map(o => o.toObject());

    // Manually populate order items
    for (let order of orders) {
      if (order.restaurantId && order.restaurantId._id) {
        const menu = await Menu.findOne({ restaurantId: order.restaurantId._id });
        if (menu && menu.menuItems) {
          order.orderItems = order.orderItems.map((orderItem) => {
            const menuItemDetails = menu.menuItems.find(
              (mi) => mi._id.toString() === orderItem.itemId.toString()
            );
            return {
              ...orderItem,
              itemId: menuItemDetails || orderItem.itemId,
            };
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching rider orders:", error);
    next(error);
  }
};

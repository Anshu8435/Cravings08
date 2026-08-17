import Order from '../models/order.model.js';
import Customer from '../models/customer.model.js';
import Menu from '../models/menu.model.js';

export const createOrder = async (req, res, next) => {
  try {
    const {
      restaurantId,
      paymentMethod,
      orderItems,
      geoLocation,
      orderType,
      scheduledTime,
      deliveryAddress,
    } = req.body;
    const userId = req.user._id; // from AuthProtect

    let customer = await Customer.findOne({ customerId: userId });
    if (!customer) {
      customer = await Customer.create({ customerId: userId });
    }

    const { amount } = req.body;

    const newOrder = new Order({
      restaurantId,
      customerId: customer._id,
      orderItems,
      orderType: orderType || 'instant',
      scheduledTime: scheduledTime || null,
      billDetails: {
        totalAmount: amount || 0,
        platformFee: 0,
        convenienceFee: 0,
        taxAmount: 0,
        deliveryCharge: 0,
        discountAmount: 0,
        finalAmount: amount || 0,
      },
      deliveryAddress: deliveryAddress || {
        name: req.user.fullName || 'Customer',
        address: 'Madhya Pradesh, India',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pinCode: '462001',
        country: 'India',
        geoLocation: geoLocation || { lat: '0', lon: '0' },
      },
      paymentDetails: {
        paymentMethod: paymentMethod || 'upi',
        paymentStatus: 'pending',
      },
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

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      return next(err);
    }

    if (!['pending', 'accepted'].includes(order.orderStatus)) {
      const err = new Error('Order cannot be cancelled in its current state');
      err.statusCode = 400;
      return next(err);
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let customer = await Customer.findOne({ customerId: userId });
    if (!customer) {
      customer = await Customer.create({ customerId: userId });
    }

    let orders = await Order.find({ customerId: customer._id })
      .populate('restaurantId', 'restaurantName email phone')
      .sort({ createdAt: -1 });

    orders = orders.map((o) => o.toObject());

    for (let order of orders) {
      if (order.restaurantId && order.restaurantId._id) {
        const menu = await Menu.findOne({ restaurantId: order.restaurantId._id });
        if (menu && menu.menuItems) {
          order.orderItems = order.orderItems.map((orderItem) => {
            const menuItemDetails = menu.menuItems.find(
              (mi) => mi._id.toString() === orderItem.itemId.toString(),
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
    console.error('Error fetching orders:', error);
    next(error);
  }
};

export const getAllOrdersForRider = async (req, res, next) => {
  try {
    let orders = await Order.find({
      orderStatus: {
        $in: [
          'accepted',
          'preparing',
          'ready',
          'pickedUp',
          'onTheWay',
          'outForDelivery',
          'delivered',
        ],
      },
    })
      .populate('restaurantId', 'restaurantName email phone')
      .populate('customerId', 'customerId')
      .sort({ createdAt: -1 });

    orders = orders.map((o) => o.toObject());

    for (let order of orders) {
      if (order.restaurantId && order.restaurantId._id) {
        const menu = await Menu.findOne({ restaurantId: order.restaurantId._id });
        if (menu && menu.menuItems) {
          order.orderItems = order.orderItems.map((orderItem) => {
            const menuItemDetails = menu.menuItems.find(
              (mi) => mi._id.toString() === orderItem.itemId.toString(),
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
    console.error('Error fetching rider orders:', error);
    next(error);
  }
};

export const getRestaurantOrders = async (req, res, next) => {
  try {
    const { restaurantId } = req.query;
    const query = restaurantId ? { restaurantId } : {};
    const orders = await Order.find(query)
      .populate('customerId', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersForAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('restaurantId', 'restaurantName')
      .populate('customerId', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = [
      'pending',
      'accepted',
      'preparing',
      'ready',
      'pickedUp',
      'onTheWay',
      'outForDelivery',
      'delivered',
      'cancelled',
      'failed',
      'rejected',
    ];
    if (!validStatuses.includes(status)) {
      const err = new Error('Invalid order status');
      err.statusCode = 400;
      return next(err);
    }

    const order = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

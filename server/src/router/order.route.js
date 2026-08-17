import express from 'express';
import {
  AuthProtect,
  RestaurantAuthProtect,
  AdminAuthProtect,
} from '../middleware/auth.middelware.js';
import {
  createOrder,
  getMyOrders,
  getAllOrdersForRider,
  getRestaurantOrders,
  getAllOrdersForAdmin,
  updateOrderStatus,
  cancelOrder,
} from '../controller/order.controller.js';

const router = express.Router();

router.post('/create', AuthProtect, createOrder);
router.get('/my-orders', AuthProtect, getMyOrders);
router.get('/rider-orders', AuthProtect, getAllOrdersForRider);
router.get('/restaurant-orders', RestaurantAuthProtect, getRestaurantOrders);
router.get('/admin-orders', AdminAuthProtect, getAllOrdersForAdmin);
router.patch('/:id/status', AuthProtect, updateOrderStatus);
router.post('/:id/cancel', AuthProtect, cancelOrder);

export default router;

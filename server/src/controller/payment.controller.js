import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/order.model.js';
import Customer from '../models/customer.model.js';

// ─── Helper: check if valid live/test Razorpay keys are provided ────────────
const hasValidRazorpayKeys = () => {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  return Boolean(
    keyId &&
    keySecret &&
    !keyId.includes('example') &&
    !keyId.includes('placeholder') &&
    !keyId.includes('mock'),
  );
};

// ─── Helper: find a customer's order safely ─────────────────────────────────
const getCustomerOrder = async (userId, orderId) => {
  let customer = await Customer.findOne({ customerId: userId });
  if (!customer) {
    customer = await Customer.create({ customerId: userId });
  }
  return Order.findOne({ _id: orderId, customerId: customer._id });
};

// ─── POST /payment/create-order ──────────────────────────────────────────────
export const CreateRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId && !amount) {
      const err = new Error('orderId or amount is required');
      err.statusCode = 400;
      return next(err);
    }

    let order = null;
    let paymentAmountInINR = 100;

    if (orderId) {
      order = await getCustomerOrder(req.user._id, orderId);
      if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        return next(err);
      }

      if (order.paymentDetails?.paymentStatus === 'completed') {
        const err = new Error('Payment already completed for this order');
        err.statusCode = 400;
        return next(err);
      }

      paymentAmountInINR = order.billDetails?.finalAmount || 100;
    } else if (amount) {
      paymentAmountInINR = Number(amount);
    }

    const amountInPaise = Math.round(paymentAmountInINR * 100);

    // If Razorpay keys are not provided, operate in mock payment mode (Stage 4 requirement)
    if (!hasValidRazorpayKeys()) {
      const mockOrderId = `order_mock_${Date.now()}`;
      if (order) {
        order.paymentDetails.razorpayOrderId = mockOrderId;
        await order.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Mock Razorpay order created (Keys not configured, safe testing mode)',
        isMock: true,
        data: {
          key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId',
          keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId',
          orderId: mockOrderId,
          razorpayOrderId: mockOrderId,
          amount: amountInPaise,
          currency: 'INR',
          appOrderId: order?._id || null,
        },
      });
    }

    // Live / Test Razorpay Integration
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order ? `receipt_${order._id}` : `receipt_${Date.now()}`,
      notes: order ? { appOrderId: String(order._id) } : {},
    });

    if (order) {
      order.paymentDetails.razorpayOrderId = razorpayOrder.id;
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Razorpay order created',
      isMock: false,
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: razorpayOrder.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        appOrderId: order?._id || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /payment/verify ────────────────────────────────────────────────────
export const VerifyRazorpayPayment = async (req, res, next) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id) {
      const err = new Error('razorpay_order_id is required');
      err.statusCode = 400;
      return next(err);
    }

    let order = null;
    if (orderId) {
      order = await getCustomerOrder(req.user._id, orderId);
      if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        return next(err);
      }
    }

    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    const isMock = razorpay_order_id.startsWith('order_mock_') || !hasValidRazorpayKeys();

    if (isMock) {
      if (order) {
        order.paymentDetails.paymentStatus = 'completed';
        order.paymentDetails.razorpayOrderId = razorpay_order_id;
        order.paymentDetails.razorpayPaymentId = razorpay_payment_id || `pay_mock_${Date.now()}`;
        order.paymentDetails.razorpaySignature = razorpay_signature || 'mock_signature';
        order.paymentDetails.paidAt = new Date();
        order.orderStatus = 'accepted';
        await order.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Mock payment verified successfully',
        data: order || { status: 'verified', isMock: true },
      });
    }

    // Cryptographic HMAC-SHA256 Signature Verification
    if (!razorpay_payment_id || !razorpay_signature) {
      const err = new Error('Payment ID and Signature are required for verification');
      err.statusCode = 400;
      return next(err);
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      if (order) {
        order.paymentDetails.paymentStatus = 'failed';
        order.orderStatus = 'failed';
        await order.save();
      }

      const err = new Error('Payment signature verification failed');
      err.statusCode = 400;
      return next(err);
    }

    if (order) {
      order.paymentDetails.paymentStatus = 'completed';
      order.paymentDetails.razorpayOrderId = razorpay_order_id;
      order.paymentDetails.razorpayPaymentId = razorpay_payment_id;
      order.paymentDetails.razorpaySignature = razorpay_signature;
      order.paymentDetails.paidAt = new Date();
      order.orderStatus = 'accepted';
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and order accepted successfully',
      data: order || { status: 'verified' },
    });
  } catch (error) {
    next(error);
  }
};

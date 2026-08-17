import express from 'express';
import { AuthProtect } from '../middleware/auth.middelware.js';
import Customer from '../models/customer.model.js';

const router = express.Router();

// Customer profile query endpoint
router.get('/profile', AuthProtect, async (req, res, next) => {
  try {
    let customer = await Customer.findOne({ customerId: req.user._id });
    if (!customer) {
      customer = await Customer.create({
        customerId: req.user._id,
        addressBook: [],
        status: 'verified',
      });
    }
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        customer,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

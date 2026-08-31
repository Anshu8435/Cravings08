import DeliveryPool from "../models/deliveryPool.model.js";

// @route   GET /api/pools/active
// @desc    Get active pools within 500m of the given lat, lon
// @access  Public (for now)
export const getActivePools = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      // If no location provided, just return empty to avoid errors
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    const activePools = await DeliveryPool.find({
      status: "active",
      expiresAt: { $gt: new Date() },
      anchorLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude] // Note: MongoDB expects [longitude, latitude]
          },
          $maxDistance: 500 // 500 meters
        }
      }
    }).populate("restaurantId", "restaurantName coverImage");

    res.status(200).json({
      success: true,
      count: activePools.length,
      data: activePools
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/pools/join
// @desc    Join an active pool or create one if none exist for that restaurant nearby
// @access  Private
export const joinPool = async (req, res, next) => {
  try {
    const { restaurantId, lat, lon } = req.body;
    const customerId = req.user ? req.user._id : req.body.customerId; // Fallback for dev

    if (!restaurantId || !lat || !lon || !customerId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Find an active pool for this restaurant within 500m
    let pool = await DeliveryPool.findOne({
      restaurantId,
      status: "active",
      expiresAt: { $gt: new Date() },
      anchorLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 500
        }
      }
    });

    if (pool) {
      // Check if user is already in the pool
      const alreadyInPool = pool.participants.some(p => p.customerId.toString() === customerId.toString());
      if (!alreadyInPool) {
        pool.participants.push({ customerId });
        await pool.save();
      }
    } else {
      // Create a new pool
      pool = new DeliveryPool({
        restaurantId,
        anchorLocation: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins from now
        participants: [{ customerId }]
      });
      await pool.save();
    }

    res.status(200).json({
      success: true,
      data: pool
    });
  } catch (error) {
    next(error);
  }
};

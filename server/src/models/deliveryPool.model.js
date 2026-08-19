import mongoose from "mongoose";

const DeliveryPoolSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: true,
    },
    anchorLocation: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    participants: [
      {
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "customer",
          required: true,
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "order",
          required: false,
        }
      }
    ],
    status: {
      type: String,
      enum: ["active", "locked", "delivered"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index for geospatial queries
DeliveryPoolSchema.index({ anchorLocation: "2dsphere" });

const DeliveryPool = mongoose.model("deliveryPool", DeliveryPoolSchema);

export default DeliveryPool;

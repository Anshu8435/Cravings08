import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      required: function() { return !this.googleId; },
    },
    dob: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: function() { return !this.googleId; },
    },
    photo: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
      },
    },
    userType: {
      type: String,
      enum: ["admin", "customer", "rider", "restaurant"],
      required: true,
      default: "customer",
    },
    lastPasswordChange: {
      type: Date,
      default: null,
    },
    addresses: [
      {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, required: true },
        isDefault: { type: Boolean, default: false }
      }
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", UserSchema);

export default User;

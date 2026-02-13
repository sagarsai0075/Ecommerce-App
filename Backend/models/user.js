const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    number: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    dateOfBirth: {
      type: Date,
      default: null
    },

    address: {
      type: String,
      default: null
    },

    houseNo: {
      type: String,
      default: null
    },

    landmark: {
      type: String,
      default: null
    },

    district: {
      type: String,
      default: null
    },

    state: {
      type: String,
      default: null
    },

    pincode: {
      type: String,
      default: null
    },

    resetPasswordToken: {
      type: String
    },

    resetPasswordExpires: {
      type: Date
    },

    sellerProfile: {
      businessName: { type: String, default: null },
      category: { type: String, default: null },
      description: { type: String, default: null },
      gstNumber: { type: String, default: null },
      bankAccount: { type: String, default: null },
      ifscCode: { type: String, default: null },
      phone: { type: String, default: null },
      email: { type: String, default: null },
      address: { type: String, default: null },
      isSellerRegistered: { type: Boolean, default: false }
    },

    sellerStats: {
      totalProducts: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      orders: { type: Number, default: 0 },
      rating: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);

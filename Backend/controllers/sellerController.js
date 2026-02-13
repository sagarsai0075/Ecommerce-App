const User = require('../models/user');

const defaultStats = {
  totalProducts: 0,
  totalSales: 0,
  revenue: 0,
  orders: 0,
  rating: 0
};

const getSellerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = user.sellerProfile || {};
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSellerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      businessName,
      category,
      description,
      gstNumber,
      bankAccount,
      ifscCode,
      phone,
      email,
      address
    } = req.body;

    user.sellerProfile = {
      businessName: businessName ?? user.sellerProfile?.businessName ?? null,
      category: category ?? user.sellerProfile?.category ?? null,
      description: description ?? user.sellerProfile?.description ?? null,
      gstNumber: gstNumber ?? user.sellerProfile?.gstNumber ?? null,
      bankAccount: bankAccount ?? user.sellerProfile?.bankAccount ?? null,
      ifscCode: ifscCode ?? user.sellerProfile?.ifscCode ?? null,
      phone: phone ?? user.sellerProfile?.phone ?? null,
      email: email ?? user.sellerProfile?.email ?? null,
      address: address ?? user.sellerProfile?.address ?? null,
      isSellerRegistered: true
    };

    const updatedUser = await user.save();
    res.json(updatedUser.sellerProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getSellerStats = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.sellerStats || defaultStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSellerStats = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      totalProducts,
      totalSales,
      revenue,
      orders,
      rating
    } = req.body;

    user.sellerStats = {
      totalProducts: totalProducts ?? user.sellerStats?.totalProducts ?? 0,
      totalSales: totalSales ?? user.sellerStats?.totalSales ?? 0,
      revenue: revenue ?? user.sellerStats?.revenue ?? 0,
      orders: orders ?? user.sellerStats?.orders ?? 0,
      rating: rating ?? user.sellerStats?.rating ?? 0
    };

    const updatedUser = await user.save();
    res.json(updatedUser.sellerStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSellerProfile,
  updateSellerProfile,
  getSellerStats,
  updateSellerStats
};

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getSellerProfile,
  updateSellerProfile,
  getSellerStats,
  updateSellerStats
} = require('../controllers/sellerController');

const router = express.Router();

router.get('/profile', protect, getSellerProfile);
router.put('/profile', protect, updateSellerProfile);
router.get('/stats', protect, getSellerStats);
router.put('/stats', protect, updateSellerStats);

module.exports = router;

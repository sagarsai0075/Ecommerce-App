const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createRazorpayOrder,
  verifyPayment
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/:id', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;

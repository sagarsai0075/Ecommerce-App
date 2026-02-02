const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// CREATE RAZORPAY ORDER
const createRazorpayOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const options = {
      amount: order.totalPrice * 100, // ₹ → paise
      currency: 'INR',
      receipt: `order_${order._id}`
    };

    const razorpayOrder = await razorpay.orders.create(options);
    res.json(razorpayOrder);

  } catch (error) {
    res.status(500).json({ message: 'Payment creation failed' });
  }
};

// VERIFY PAYMENT
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const order = await Order.findById(orderId);
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = razorpay_payment_id;

    await order.save();

    res.json({ message: 'Payment verified & order paid' });

  } catch (error) {
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };

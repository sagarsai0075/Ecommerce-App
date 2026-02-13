const Order = require('../models/order');
const Cart = require('../models/cart');


// @desc   Create new order
// @route  POST /api/orders
// @access Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

// 🧹 CLEAR USER CART AFTER ORDER
const Cart = require('../models/cart');
const cart = await Cart.findOne({ user: req.user });

if (cart) {
  cart.cartItems = [];
  await cart.save();
}

res.status(201).json(createdOrder);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc   Get logged in user's orders
// @route  GET /api/orders/myorders
// @access Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Get orders (admin gets all, user gets own)
// @route  GET /api/orders
// @access Private
const getOrders = async (req, res) => {
  try {
    if (req.userRole === 'admin') {
      const orders = await Order.find({})
        .populate('user', 'id name email');
      return res.json(orders);
    }

    const orders = await Order.find({ user: req.user });
    return res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Get order by ID
// @route  GET /api/orders/:id
// @access Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure user owns the order (or admin later)
    if (order.user._id.toString() !== req.user.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Get all orders (admin)
// @route  GET /api/orders
// @access Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Mark order as delivered
// @route  PUT /api/orders/:id/deliver
// @access Admin
const markOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Mark order as paid (Dummy / COD)
// @route  PUT /api/orders/:id/pay
// @access Private
const markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  getAllOrders,
  markOrderDelivered,
  markOrderPaid
};




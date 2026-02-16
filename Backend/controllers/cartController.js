const Cart = require('../models/cart');
const Product = require('../models/product');

// @desc   Add item to cart
// @route  POST /api/cart
// @access Private
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: req.user,
        cartItems: [
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            qty: qty || 1
          }
        ]
      });
    } else {
      // Cart exists
      const itemIndex = cart.cartItems.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.cartItems[itemIndex].qty += qty || 1;
      } else {
        cart.cartItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: qty || 1
        });
      }
    }

    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc   Get logged-in user's cart
// @route  GET /api/cart
// @access Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.json({ cartItems: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc   Remove item from cart
// @route  DELETE /api/cart/:productId
// @access Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.cartItems = cart.cartItems.filter(
      item => item.product.toString() !== req.params.productId
    );

    const updatedCart = await cart.save();
    res.json(updatedCart);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Update item quantity in cart
// @route  PUT /api/cart/:productId
// @access Private
const updateCartItem = async (req, res) => {
  try {
    const { qty } = req.body;

    if (qty === undefined || qty === null) {
      return res.status(400).json({ message: 'Quantity is required' });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.cartItems.find(
      cartItem => cartItem.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    item.qty = Number(qty);

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc   Clear cart
// @route  DELETE /api/cart
// @access Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.cartItems = [];
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addToCart, getCart, removeFromCart, updateCartItem, clearCart };

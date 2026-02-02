const Product = require('../models/Product');

// @desc   Get all products
// @route  GET /api/products
// @access Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc   Add new product
// @route  POST /api/products
// @access Admin
const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, countInStock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      countInStock
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getProducts, addProduct };

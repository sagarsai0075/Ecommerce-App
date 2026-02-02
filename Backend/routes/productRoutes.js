const express = require('express');
const { getProducts, addProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, adminOnly, addProduct);

module.exports = router;

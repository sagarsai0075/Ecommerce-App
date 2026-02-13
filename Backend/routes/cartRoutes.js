const express = require('express');
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const getHandler = name => {
	const handler = cartController[name];
	if (typeof handler !== 'function') {
		return (req, res) => {
			res.status(500).json({ message: `Cart handler ${name} is not available` });
		};
	}
	return handler;
};

router.post('/', protect, getHandler('addToCart'));
router.get('/', protect, getHandler('getCart'));
router.put('/:productId', protect, getHandler('updateCartItem'));
router.delete('/:productId', protect, getHandler('removeFromCart'));
router.delete('/', protect, getHandler('clearCart'));

module.exports = router;

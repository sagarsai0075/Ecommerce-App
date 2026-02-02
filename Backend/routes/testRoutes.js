const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/protected', protect, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    userId: req.user
  });
});

module.exports = router;

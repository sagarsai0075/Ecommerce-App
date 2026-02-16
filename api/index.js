const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

mongoose.set('bufferCommands', false);

app.use(cors());
app.use(express.json());

// Routes (IMPORTANT: ../Backend/)
app.use('/api/auth', require('../Backend/routes/authRoutes'));
app.use('/api/test', require('../Backend/routes/testRoutes'));
app.use('/api/orders', require('../Backend/routes/orderRoutes'));
app.use('/api/cart', require('../Backend/routes/cartRoutes'));
app.use('/api/payment', require('../Backend/routes/paymentRoutes'));
app.use('/api/products', require('../Backend/routes/productRoutes'));
app.use('/api/seller', require('../Backend/routes/sellerRoutes'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Test route
app.get('/', (req, res) => {
  res.send('E-Commerce Backend Running');
});

// ❌ REMOVE app.listen()
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// ✅ Export app for Vercel
module.exports = app;
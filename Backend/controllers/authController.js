const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  number: user.number,
  role: user.role,
  dateOfBirth: user.dateOfBirth || null,
  houseNo: user.houseNo || null,
  address: user.address || null,
  landmark: user.landmark || null,
  district: user.district || null,
  state: user.state || null,
  pincode: user.pincode || null
});

// REGISTER USER
const registerUser = async (req, res) => {
  try {

    const { name, email, password, number } = req.body; // ✅ added number

    // Check all fields
    if (!name || !email || !password || !number) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check existing user (email OR number)
    const existingUser = await User.findOne({
      $or: [{ email }, { number }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      number,                 // ✅ save number
      password: hashedPassword
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: buildUserResponse(user)
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};


// LOGIN USER  ✅ (THIS WAS MISSING)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

   const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);
//#region 
    res.status(200).json({
      message: 'Login successful',
      token,
      user: buildUserResponse(user)
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET CURRENT USER
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(buildUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      name,
      email,
      number,
      dateOfBirth,
      houseNo,
      address,
      landmark,
      district,
      state,
      pincode
    } = req.body;

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    if (number && number !== user.number) {
      const existingNumber = await User.findOne({ number });
      if (existingNumber) {
        return res.status(400).json({ message: 'Number already in use' });
      }
      user.number = number;
    }

    if (name !== undefined) user.name = name;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth || null;
    if (houseNo !== undefined) user.houseNo = houseNo || null;
    if (address !== undefined) user.address = address || null;
    if (landmark !== undefined) user.landmark = landmark || null;
    if (district !== undefined) user.district = district || null;
    if (state !== undefined) user.state = state || null;
    if (pincode !== undefined) user.pincode = pincode || null;

    const updatedUser = await user.save();
    res.json(buildUserResponse(updatedUser));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// FORGOT PASSWORD (DEV-FRIENDLY TOKEN RETURN)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If an account exists, a reset link was sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    res.json({
      message: 'Reset token generated',
      resetToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
};

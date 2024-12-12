const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require('../middleware/authmiddleware');
const User = require("../models/user"); // Assuming you have a User model
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'secureAdminPassword';

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, isAdmin: user.role === 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password, role, adminPassword } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    if (role === 'admin') {
      // Validate the admin password for admin registration
      if (adminPassword !== ADMIN_PASSWORD) {
        return res.status(400).json({ message: 'Invalid admin password' });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Default role is user
    });

    await newUser.save();

    const message = role === 'admin' 
      ? 'Admin Registered Successfully'
      : 'User Registered Successfully';
    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

// Login route with JWT generation
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = generateToken(user);

        const temp = {
          name: user.name,
          email: user.email,
          isAdmin: user.role === 'admin',
          _id: user._id,
          token, // Send the token back to the frontend
        };
        res.send(temp);
      } else {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error while logging in', error });
  }
});

// Protected route example
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Route to get all users (Protected for admins only)
router.get("/getallusers", verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const users = await User.find();
    res.send(users);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user"); // Assuming you have a User model

// Define the secure admin password in your environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'secureAdminPassword';

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password, role, adminPassword } = req.body;

  try {
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

    // Notify of successful registration
    const message = role === 'admin' 
      ? 'Admin Registered Successfully'
      : 'User Registered Successfully';
    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

// Login route with password comparison
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const temp = {
          name: user.name,
          email: user.email,
          isAdmin: user.role === 'admin',
          _id: user._id,
        };
        res.send(temp);
      } else {
        return res.status(400).json({ message: 'Login Failed' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// Route to get all users
router.get("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;

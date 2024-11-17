const express = require("express");
const bcrypt = require("bcryptjs"); // Import bcrypt for hashing passwords
const router = express.Router();
const User = require("../models/user");

// Registration Route

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
    });

    try {
        const user = await newUser.save();
        res.send('User Registered Successfully');
    } catch (error) {
        return res.status(400).json({ error });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            // Compare the entered password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const userResponse = {
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    _id: user._id,
                };
                res.send(userResponse);
            } else {
                return res.status(400).json({ message: 'Invalid Credentials' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = router;

// routes/signup.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Manager = require('../Models/Managerschema');

// Signup route
// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Check if any field is missing
    const errors = [];
    if (!name) {
      errors.push({ msg: 'Name field is required' });
    }
    if (!email) {
      errors.push({ msg: 'Email field is required' });
    }
    if (!password) {
      errors.push({ msg: 'Password field is required' });
    }
    if (!confirmPassword) {
      errors.push({ msg: 'Confirm Password field is required' });
    }

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Check if user already exists
    let user = await Manager.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'Manager already exists' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    // Create new user
    user = new Manager({
      name,
      email,
      password
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    res.status(201).json({ msg: 'Manager registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if any field is missing
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    // Check if user exists
    const user = await Manager.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Passwords match, send response
    res.json({ msg: 'Login successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

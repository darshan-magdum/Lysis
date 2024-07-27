const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { jwtkey } = require('../keys'); 
const Admin = require('../Models/AdminSchema'); 

// Validation schema for login using Joi
const loginSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().required().label('Password'),
});

// Route: POST /login
router.post('/login', async (req, res) => {
  try {
    // Validate request body using Joi
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Check if admin exists
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Admin authenticated, generate JWT token
    const token = jwt.sign({ adminId: admin._id, role: admin.role }, jwtkey);

    // Return the token and any additional data you may need
    res.status(200).send({ token, adminId: admin._id, role: admin.role, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


// Route: GET /Admin/:adminId
router.get('/:adminId', async (req, res) => {
  const adminId = req.params.adminId;

  try {
    // Find admin by ID and exclude password field
    const admin = await Admin.findById(adminId).select('-password');

    // Check if admin exists
    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    // Return admin details
    res.status(200).send(admin);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});



module.exports = router;

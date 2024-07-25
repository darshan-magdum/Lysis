const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { jwtkey } = require('../keys');
const ManagerAccount = require('../Models/Managerschema');

// Validation schema for signup using Joi
const signupSchema = Joi.object({
  name: Joi.string().required().label('Name'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().required().min(6).label('Password'),
});

// Route: POST /signup
router.post('/signup', async (req, res) => {
  try {
    // Validate request body using Joi
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { name, email, password } = req.body;

    // Check if manager already exists
    let manager = await ManagerAccount.findOne({ email });
    if (manager) {
      return res.status(400).send({ message: 'Manager already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new manager instance
    manager = new ManagerAccount({
      name,
      email,
      password: hashedPassword,
    });

    // Save the manager to the database
    await manager.save();

    // Generate JWT token
    const token = jwt.sign({ managerId: manager._id }, jwtkey);

    // Return token and manager ID
    res.status(201).send({ token, managerId: manager._id, message: 'Manager registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

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

    // Check if manager exists
    let manager = await ManagerAccount.findOne({ email });
    if (!manager) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Manager authenticated, generate JWT token
    const token = jwt.sign({ managerId: manager._id }, jwtkey);

    // Return the token and any additional data you may need
    res.status(200).send({ token, managerId: manager._id, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Route: GET /managers
router.get('/managers', async (req, res) => {
  try {
    // Fetch all managers from the database
    const managers = await ManagerAccount.find();

    // Return the array of managers
    res.status(200).send(managers);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


// Route: GET /manager/:managerId
router.get('/manager/:managerId', async (req, res) => {
  const managerId = req.params.managerId;

  try {
    // Find manager by ID in the database
    const manager = await ManagerAccount.findById(managerId);

    if (!manager) {
      return res.status(404).send({ message: 'Manager not found' });
    }

    // Return manager details
    res.status(200).send(manager);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


module.exports = router;

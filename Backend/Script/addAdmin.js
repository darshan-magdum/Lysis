require('dotenv').config({ path: '../.env' });


const mongoose = require('mongoose');
const Admin = require('../Models/AdminSchema'); 

// MongoDB connection URL from .env
const mongoURL = process.env.DB;

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    // Create an admin instance using .env variables
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: process.env.ADMIN_ROLE 
    });

    // Save the admin to the database
    try {
      await admin.save();
      console.log('Admin successfully inserted');
    } catch (err) {
      console.error('Error inserting admin:', err.message);
    }

    // Close the connection
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

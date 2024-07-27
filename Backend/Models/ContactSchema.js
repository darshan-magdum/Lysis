const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required'],
    validate: {
      validator: function(v) {
        return v.length === 10; // Ensure exactly 10 characters
      },
      message: 'Contact number must be exactly 10 characters'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  
  createdAt: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model('Contact', contactSchema);

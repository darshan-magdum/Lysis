const mongoose = require('mongoose');

const Managerschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    default: 'Manager'
  },
  AssignedProjects: {
    type: [String], 
    required: true, 
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one Project must be Assigned'
    }
  }
});

module.exports = mongoose.model('Manager_Account', Managerschema);

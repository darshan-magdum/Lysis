const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Regular expression for password validation
const passwordRegex = /^(?=.*[A-Z])(?=.*\d.*\d.*\d.*\d.*\d)(?=.*[!@#$%^&*()_+{}[\]:;"'<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}[\]:;"'<>,.?~\\/-]{8,}$/;

const adminSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: function(v) {
        return passwordRegex.test(v);
      },
      message: 'Password must contain at least one capital letter, five digits, and one special symbol'
    }
  },
  role: {
    type: String,
  }
});

const Admin = mongoose.model('Admin_Account', adminSchema);

module.exports = Admin;

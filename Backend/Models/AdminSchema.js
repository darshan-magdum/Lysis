const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Regular expression for password validation
const passwordRegex = /^(?=.*[A-Z])(?=.*\d.*\d.*\d.*\d.*\d)(?=.*[!@#$%^&*()_+{}[\]:;"'<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}[\]:;"'<>,.?~\\/-]{8,}$/;

const adminSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensures email is unique at the database level
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
    default: 'Admin' 
  }
});

// Pre-save hook to hash the password
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Admin = mongoose.model('Admin_Account', adminSchema);

module.exports = Admin;

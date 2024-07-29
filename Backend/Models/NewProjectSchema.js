const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true 
  },
  description: {
    type: String,
    required: [true, 'Description is required'] 
  }
});


module.exports = mongoose.model('New_Projects', projectSchema);

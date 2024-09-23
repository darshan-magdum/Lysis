const mongoose = require('mongoose');

const ProjectSummarySchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  projectSummary: {
    type: String,
    required: [true, 'Project Summary is required'],
    trim: true
  },
  managerId:{
    type:String,
    required: [true, 'Manager ID is required'],
  }
});

module.exports = mongoose.model('ProjectSummary', ProjectSummarySchema);

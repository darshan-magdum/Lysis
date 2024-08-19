const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  FileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  Code: {
    type: String,
    required: [true, 'Code is required'],
    trim: true
  },
  Analysis: {
    type: String,
    required: [true, 'Analysis is required'],
    trim: true
  }
});

const ProjectDetailsSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  files: {
    type: [FileSchema],
    required: [true, 'Files are required']
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

module.exports = mongoose.model('ProjectDetails', ProjectDetailsSchema);

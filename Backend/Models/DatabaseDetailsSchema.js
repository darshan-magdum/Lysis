const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    FileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true
    },
    Script: {
      type: String,
      required: [true, 'Script is required'],
      trim: true
    },
    Analysis: {
      type: String,
      required: [true, 'Analysis is required'],
      trim: true
    },
    ERScript: {
      type: String,
      required: [true, 'ER Script is required'],
      trim: true
    }

  });
  
const DatabaseDetailsSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  files: {
    type: [FileSchema],
    required: [true, 'Files are required']
  },
  managerId:{
    type:String,
    required: [true, 'Manager ID is required'],
  }
});

module.exports = mongoose.model('DatabaseDetails', DatabaseDetailsSchema);

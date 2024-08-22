const mongoose = require('mongoose');

const UMLSchema = new mongoose.Schema({
  UMLData: {
    type: String,
    required: [true, 'UML Data is required'],
    trim: true 
  },
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  managerId:{
    type:String,
    required: [true, 'Manager ID is required'],
  }
});
module.exports = mongoose.model('UML', UMLSchema);

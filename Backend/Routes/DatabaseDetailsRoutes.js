const express = require('express');
const Project = require('../Models/DatabaseDetailsSchema');
const router = express.Router();

// Create a new project
router.post('/AddNewDatabaseDetails', async (req, res) => {
  try {
      const { projectName, files, managerId} = req.body;

      if (!projectName || !files || !managerId) {
          return res.status(400).json({
              errors: [
                  !projectName && 'Project name is required.',
                  !files && 'Database information is required.',                  
                  !managerId && 'Manager Id is required.'
              ].filter(Boolean)
          });
      }

      const newDatabase = new Project({ projectName, files, managerId });
      await newDatabase.save();

      res.status(201).json({
          message: 'Database Data created successfully',
          project: newDatabase
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
//Route for Perticular project Details
router.get('/DatabaseDetails/:managerId', async (req, res) => {
  const { managerId } = req.params;

  try {
    const DatabaseData = await Project.find({  managerId });

    if (!DatabaseData) {
      return res.status(404).send({ message: 'Database Data not found' });
    }

    // Return Database Data details including assigned manager
    res.status(200).send(DatabaseData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


  module.exports = router;
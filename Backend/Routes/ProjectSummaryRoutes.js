const express = require('express');
const Project = require('../Models/ProjectSummarySchema');
const router = express.Router();

// Create a new project
router.post('/AddProjectsSummary', async (req, res) => {
  try {
      const { projectName, projectSummary, managerId} = req.body;

      if (!projectName || !managerId || !projectSummary) {
          return res.status(400).json({
              errors: [
                  !projectName && 'Project name is required.',
                  !projectSummary && 'Project Summary is required.',
                  !managerId && 'Manager Id is required.'
              ].filter(Boolean)
          });
      }

      const newProjectSummary = new Project({ projectName, projectSummary, managerId });
      await newProjectSummary.save();

      res.status(201).json({
          message: 'Project Summary created successfully',
          project: newProjectSummary
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
//Route for Perticular project Details
router.get('/ProjectsSummary/:managerId', async (req, res) => {
  const { managerId } = req.params;

  try {
    const project = await Project.find({  managerId });

    if (!project) {
      return res.status(404).send({ message: 'Project not found' });
    }

    // Return project details including assigned manager
    res.status(200).send(project);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


  module.exports = router;
const express = require('express');
const Project = require('../Models/ProjectDetailsSchema');
const router = express.Router();

// Create a new project
router.post('/AddNewProjectsDetails', async (req, res) => {
  try {
      const { projectName, files, projectSummary, managerId} = req.body;

      if (!projectName || !files || !projectSummary) {
          return res.status(400).json({
              errors: [
                  !projectName && 'Project name is required.',
                  !files && 'File data is required.',
                  !projectSummary && 'Project Summary is required.',
                  !managerId && 'Manager Id is required.'
              ].filter(Boolean)
          });
      }

      const newProject = new Project({ projectName, files, projectSummary, managerId });
      await newProject.save();

      res.status(201).json({
          message: 'Project created successfully',
          project: newProject
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


  module.exports = router;
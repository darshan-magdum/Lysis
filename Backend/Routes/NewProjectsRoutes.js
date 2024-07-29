const express = require('express');
const router = express.Router();
const Project = require('../Models/NewProjectSchema');

// Create a new project
router.post('/AddNewProjects', async (req, res) => {
  try {
    const { projectName, description } = req.body;
    const errors = [];

    if (!projectName) {
      errors.push('Project name is required.');
    }
    
    if (!description) {
      errors.push('Description is required.');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const newProject = new Project({ projectName, description });
    await newProject.save();
    
    res.status(201).json({
      message: 'Project created successfully',
      project: newProject
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all projects
router.get('/GetAllprojects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      message: 'Projects retrieved successfully',
      projects: projects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a project by ID
router.get('/Getbyprojects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json({
      message: 'Project retrieved successfully',
      project: project
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit a project by ID
router.put('/editprojects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { projectName, description } = req.body;
    const errors = [];

    if (!projectName) {
      errors.push('Project name is required.');
    }
    
    if (!description) {
      errors.push('Description is required.');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { projectName, description },
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a project by ID
router.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json({
      message: 'Project deleted successfully',
      project: deletedProject
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

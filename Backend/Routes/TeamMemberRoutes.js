const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { jwtkey } = require('../keys');
const TeamMember = require('../Models/TeamMemberSchema');

// Validation schema for signup using Joi
const signupSchema = Joi.object({
  name: Joi.string().required().label('Name'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().required().min(6).label('Password'),
  assignedProjects: Joi.array().items(Joi.string()).required().label('AssignedProjects')
});

// Route: POST /signup
router.post('/signup', async (req, res) => {
  try {
    // Validate request body using Joi
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { name, email, password, assignedProjects } = req.body;

    // Check if team member already exists
    let teamMember = await TeamMember.findOne({ email });
    if (teamMember) {
      return res.status(400).send({ message: 'Team Member already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new team member with the provided assignedProjects
    teamMember = new TeamMember({
      name,
      email,
      password: hashedPassword,
      assignedProjects
    });

    // Save the team member to the database
    await teamMember.save();

    // Generate JWT token
    const token = jwt.sign({ teamMemberId: teamMember._id }, jwtkey);

    // Return token and team member ID
    res.status(201).send({ token, teamMemberId: teamMember._id, role: teamMember.role, message: 'Team Member registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Validation schema for login using Joi
const loginSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().required().label('Password'),
});

// Route: POST /login
router.post('/login', async (req, res) => {
  try {
    // Validate request body using Joi
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Check if team member exists
    let teamMember = await TeamMember.findOne({ email });
    if (!teamMember) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, teamMember.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Team member authenticated, generate JWT token
    const token = jwt.sign({ teamMemberId: teamMember._id }, jwtkey);

    // Return the token and any additional data you may need
    res.status(200).send({ token, teamMemberId: teamMember._id, role: teamMember.role, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Route: GET /teammembers
router.get('/Getallteammembers', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().select('-password');

    // Return the array of team members
    res.status(200).send(teamMembers);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Route: GET /teammember/:teamMemberId
router.get('/teammember/:teamMemberId', async (req, res) => {
  const teamMemberId = req.params.teamMemberId;

  try {
    const teamMember = await TeamMember.findById(teamMemberId).select('-password');

    if (!teamMember) {
      return res.status(404).send({ message: 'Team Member not found' });
    }

    // Return team member details including assignedProjects
    res.status(200).send(teamMember);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

const updateSchema = Joi.object({
  name: Joi.string().optional().label('Name'),
  email: Joi.string().email().optional().label('Email'),
  assignedProjects: Joi.array().items(Joi.string()).optional().label('AssignedProjects')
});

// Route: PUT /teammember/:teamMemberId
router.put('/editteammember/:teamMemberId', async (req, res) => {
  const teamMemberId = req.params.teamMemberId;
  
  try {
    // Validate request body using Joi
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { name, email, assignedProjects } = req.body;

    // Find the team member by ID
    let teamMember = await TeamMember.findById(teamMemberId);
    if (!teamMember) {
      return res.status(404).send({ message: 'Team Member not found' });
    }

    // Update fields if provided
    if (name) teamMember.name = name;
    if (email) teamMember.email = email;
    if (assignedProjects) teamMember.assignedProjects = assignedProjects;

    // Save the updated team member details
    await teamMember.save();

    // Return success response
    res.status(200).send({ message: 'Team Member updated successfully', teamMember });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;

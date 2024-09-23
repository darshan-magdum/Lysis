require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");

// Database connection
connection();

// Middlewares
app.use(express.json({ limit: '400mb' }));
app.use(express.urlencoded({ limit: '400mb', extended: true }));
app.use(cors());

// Routes
const AdminAuth = require('./Routes/AdminRoutes');
const ManagerAuth = require('./Routes/ManagerRoutes');
const TeamMemberAuth = require('./Routes/TeamMemberRoutes');
const ContactRoutes = require('./Routes/ContactRoutes');
const AddNewProjectsRoutes = require('./Routes/NewProjectsRoutes');
const AddNewProjectDetailsRoutes = require('./Routes/ProjectDetailsRoutes');
const AddProjectSummaryRoutes = require('./Routes/ProjectSummaryRoutes');
const AddNewUMLData = require('./Routes/UMLRoutes');
const AddNewDatabaseDetailsRoutes = require('./Routes/DatabaseDetailsRoutes');


app.use('/Manager', ManagerAuth);
app.use('/Admin', AdminAuth);
app.use('/Contact', ContactRoutes);
app.use('/NewProjects', AddNewProjectsRoutes);
app.use('/TeamMember', TeamMemberAuth);
app.use('/NewProjectDetails', AddNewProjectDetailsRoutes);
app.use('/NewProjectSummary', AddProjectSummaryRoutes);
app.use('/NewUMLData', AddNewUMLData);
app.use('/NewDatabaseDetails', AddNewDatabaseDetailsRoutes);

// Start server
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));

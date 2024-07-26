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
const ContactRoutes = require('./Routes/ContactRoutes');

app.use('/Manager', ManagerAuth);
app.use('/Admin', AdminAuth);
app.use('/Contact', ContactRoutes);

// Start server
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));

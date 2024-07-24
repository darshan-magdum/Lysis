require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");



// database connection
connection();

// middlewares
app.use(express.json({ limit: '400mb' }));
app.use(express.urlencoded({ limit: '400mb', extended: true }));


app.use(cors());


// routes






const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
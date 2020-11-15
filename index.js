const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
var cors = require("cors");

// Import routes
const authRoute = require("./routes/auth");
const todoRoutes = require("./routes/todos");

dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("Connected to DB ");
});

// Middleware
app.use(express.json());

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type", "auth-token"]
};

app.use(cors(corsOpts));

// Route Middleware
app.use("/api/user", authRoute);
app.use("/api/todos", todoRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server up and running", port);
});

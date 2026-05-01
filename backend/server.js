const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 5001;
require("dotenv").config();

const app = express(); // ✅ create app FIRST

// Middleware
app.use(cors());
app.use(express.json()); // VERY IMPORTANT for POST requests

// DB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Test route
app.get("/", (req, res) => {
    res.send("API Running");
});

// Server start

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use(cors({

  origin: "*", // later replace with your frontend URL

  credentials: true

}));
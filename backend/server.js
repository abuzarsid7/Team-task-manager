const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 5001;

// Validate required env vars early to avoid silent failures
const requiredEnvs = ["MONGO_URI", "JWT_SECRET"];
const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  console.error("Create a .env file (see backend/.env.example) and restart the server.");
  // Do not exit here to allow running in environments where envs are injected differently,
  // but log prominently so developers notice.
}

const app = express(); // ✅ create app FIRST

// Middleware
app.use(cors());
app.use(express.json()); // VERY IMPORTANT for POST requests

// DB connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err.message || err));
} else {
  console.error("Skipping MongoDB connection because MONGO_URI is not set.");
}

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

// Register remaining routes
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Reconfigure CORS explicitly for development if needed
app.use(cors({
  origin: "*",
  credentials: true,
}));
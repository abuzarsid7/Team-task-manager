const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { ensureTaskAssignee } = require("../middleware/roleMiddleware");
const { getProjectTasks, getMyTasks, getDashboard, createTask, updateTaskStatus } = require("../controllers/taskController");

router.get("/my-tasks", authMiddleware, getMyTasks);
router.get("/project/:projectId", authMiddleware, getProjectTasks);
router.get("/dashboard", authMiddleware, getDashboard);
router.post("/create", authMiddleware, createTask);
router.put("/update-status", authMiddleware, ensureTaskAssignee, updateTaskStatus);

module.exports = router;
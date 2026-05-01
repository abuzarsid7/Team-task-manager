const mongoose = require("mongoose");
const Task = require("../models/task");
const Project = require("../models/project");

// ✅ Get tasks for a specific project
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      member => member.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("project", "name description")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get tasks assigned to the current user
exports.getMyTasks = async (req, res) => {
  try {
    const userId = req.user.userId;

    const tasks = await Task.find({ assignedTo: userId })
      .populate("project", "name description")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Dashboard Stats
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Total tasks for user
    const totalTasks = await Task.countDocuments({
      assignedTo: userId
    });

    // 2. Tasks by status
    const statusStats = await Task.aggregate([
      { $match: { assignedTo: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Overdue tasks
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: "Done" }
    });

    // 4. Tasks per project
    const projectStats = await Task.aggregate([
      { $match: { assignedTo: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$project",
          count: { $sum: 1 }
        }
      }
    ]);

    // 5. Tasks per user
    const tasksPerUser = await Task.aggregate([
      {
        $match: {
          assignedTo: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalTasks,
      statusStats,
      overdueTasks,
      projectStats,
      tasksPerUser
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, projectId, assignedTo } = req.body;

    // Check project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only project members can create tasks
    if (!project.members.includes(req.user.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project: projectId,
      assignedTo
    });

    res.status(201).json({
      message: "Task created",
      task
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ✅ Update status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    await task.save();

    res.json({
      message: "Task updated",
      task
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
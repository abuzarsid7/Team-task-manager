const Task = require("../models/task");
const Project = require("../models/project");

exports.ensureTaskAssignee = async (req, res, next) => {
	try {
		const { taskId } = req.body;

		const task = await Task.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user.userId;

		const project = await Project.findById(task.project).select("admin");
		const isProjectAdmin = project && project.admin.toString() === req.user.userId;

		if (!isAssignee && !isProjectAdmin) {
			return res.status(403).json({ message: "Not allowed" });
		}

		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

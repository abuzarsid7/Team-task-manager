const User = require("../models/user");
const Project = require("../models/project");

const normalizeEmail = (email) => (email || "").trim().toLowerCase();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ✅ Get projects for the current user
exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.userId;

    const projects = await Project.find({
      members: userId
    })
      .populate("members", "name email")
      .populate("admin", "name email");

    res.json({
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      admin: req.user.userId,
      members: [req.user.userId]
    });

    res.status(201).json({
      message: "Project created",
      project
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Add member to project
exports.addMember = async (req, res) => {
  try {
    const { projectId, email } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (project.members.some(member => member.toString() === user._id.toString()))  {
      return res.status(400).json({ message: "User already a member" });
    }

    project.members.push(user._id);
    await project.save();

    res.json({
      message: "Member added successfully",
      project
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Remove member from project
exports.removeMember = async (req, res) => {
  try {
    const { projectId, email } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    const user =
      (await User.findOne({ email: normalizedEmail })) ||
      (await User.findOne({ email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i") }));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (project.admin.toString() === user._id.toString()) {
      return res.status(400).json({ message: "Admin cannot be removed" });
    }

    const isMember = project.members.some(member => member.toString() === user._id.toString());
    if (!isMember) {
      return res.status(400).json({ message: "User is not a member" });
    }

    project.members = project.members.filter(
      member => member.toString() !== user._id.toString()
    );
    await project.save();

    res.json({
      message: "Member removed successfully",
      project
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
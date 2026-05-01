const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getProjects, createProject, addMember, removeMember } = require("../controllers/projectController");

router.get("/", authMiddleware, getProjects);
router.post("/create", authMiddleware, createProject);
router.post("/add-member", authMiddleware, addMember);
router.post("/remove-member", authMiddleware, removeMember);
module.exports = router;
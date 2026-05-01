import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    API.get("/projects").then((res) => setProjects(res.data.projects));
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "true") setShowModal(true);
  }, [location.search]);

  return (
    <div>
      <Navbar />
      <div className="app-container">
        <div className="page-header">
          <div className="page-header-content">
            <h1>Projects</h1>
            <p>Create and manage projects, assign team members, and track tasks in one place.</p>
          </div>
          <button className="btn page-btn" onClick={() => setShowModal(true)}>
            + New Project
          </button>
        </div>

        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-state-icon">📋</div>
            <h3>No projects yet</h3>
            <p>Get started by creating your first project.</p>
            <button className="btn" onClick={() => setShowModal(true)}>Create your first project</button>
          </div>
        )}

        {showModal && (
          <CreateProjectModal
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setShowModal(false);
              API.get("/projects").then((res) => setProjects(res.data.projects));
            }}
          />
        )}
      </div>
    </div>
  );
}
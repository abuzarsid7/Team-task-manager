import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
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
      <div className="app-container mt-12">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Projects</h2>
          <div>
            <button className="btn" onClick={() => setShowModal(true)}>New Project</button>
          </div>
        </div>

        <div className="card mt-12">
          <div>
            {projects.map((p) => (
              <div className="project-item" key={p._id}>
                <Link to={`/project/${p._id}`}>{p.name}</Link>
                <div className="muted">{p.description}</div>
              </div>
            ))}
          </div>
        </div>
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
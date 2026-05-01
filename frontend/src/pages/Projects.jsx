import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    API.get("/projects").then((res) => setProjects(res.data.projects));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="app-container mt-12">
        <div className="card">
          <h2>Projects</h2>
          <div>
            {projects.map((p) => (
              <div className="project-item" key={p._id}>
                <Link to={`/project/${p._id}`}>{p.name}</Link>
                <div className="muted">{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
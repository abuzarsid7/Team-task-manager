import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/project/${project._id}`} className="project-card card">
      <div className="project-card-header">
        <h3>{project.name}</h3>
      </div>
      <p className="project-card-desc">{project.description || "No description"}</p>
      <div className="project-card-footer">
        <span className="project-count">
          {project.members?.length || 0} member{project.members?.length !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}

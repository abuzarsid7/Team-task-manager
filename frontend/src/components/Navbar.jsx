import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="nav-links">
        <Link className="nav-link" to="/dashboard">Dashboard</Link>
        <Link className="nav-link" to="/projects">Projects</Link>
        <Link className="nav-link" to="/projects?new=true">New Project</Link>
        <Link className="nav-link" to="/my-tasks">My Tasks</Link>
      </div>
      <div className="nav-right">
        {isAuthenticated ? (
          <button className="btn secondary" onClick={handleLogout}>Logout</button>
        ) : (
          <Link className="nav-link" to="/">Login</Link>
        )}
      </div>
    </header>
  );
}
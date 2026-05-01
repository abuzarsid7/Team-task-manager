import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/projects", label: "Projects" },
    { to: "/my-tasks", label: "My Tasks" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="nav-mark">TT</div>
        <div>
          <div className="nav-title">Team Task Manager</div>
          <div className="nav-subtitle">Plan, assign, and ship work</div>
        </div>
      </div>

      <nav className="nav-links" aria-label="Primary navigation">
        {links.map((link) => {
          const active = location.pathname === link.to.split("?")[0];
          return (
            <Link
              key={link.to}
              className={`nav-link ${active ? "active" : ""}`}
              to={link.to}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="nav-right">
        {isAuthenticated ? (
          <button className="btn secondary nav-logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link className="nav-link nav-login" to="/">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
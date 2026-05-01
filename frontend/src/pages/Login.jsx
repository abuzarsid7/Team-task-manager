import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-panel auth-panel-left">
          <div className="auth-badge">Team Task Manager</div>
          <h1>Welcome back</h1>
          <p>
            Sign in to review your dashboards, update task status, and keep projects moving.
          </p>
          <ul className="auth-points">
            <li>Track your assigned work in one place</li>
            <li>Jump straight to projects and kanban boards</li>
            <li>Keep team updates clean and visible</li>
          </ul>
        </div>

        <div className="auth-panel auth-panel-right">
          <div className="auth-header">
            <h2>Sign in</h2>
            <p>Enter your email and password to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button className="btn auth-btn" type="submit">Login</button>

            <div className="auth-footer">
              <span className="muted">Need an account?</span>
              <Link to="/signup" className="auth-link">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
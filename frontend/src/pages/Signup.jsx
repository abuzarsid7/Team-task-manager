import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful");
      navigate("/", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-panel auth-panel-left signup-panel">
          <div className="auth-badge">Get started</div>
          <h1>Create your workspace</h1>
          <p>
            Set up your account to create projects, manage members, and keep tasks organized.
          </p>
          <ul className="auth-points">
            <li>Create and manage projects quickly</li>
            <li>Assign work to teammates with clear ownership</li>
            <li>See task progress in a clean kanban view</li>
          </ul>
        </div>

        <div className="auth-panel auth-panel-right">
          <div className="auth-header">
            <h2>Create account</h2>
            <p>Fill in your details to join the team.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                placeholder="Your name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
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
                placeholder="Create a secure password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button className="btn auth-btn" type="submit">Signup</button>

            <div className="auth-footer">
              <span className="muted">Already have an account?</span>
              <Link to="/" className="auth-link">Back to login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
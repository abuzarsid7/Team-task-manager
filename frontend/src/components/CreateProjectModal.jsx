import { useState } from "react";
import API from "../api/axios";

export default function CreateProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/projects/create", { name, description });
      onCreated && onCreated(res.data.project || res.data);
      onClose && onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal card modal-lg">
        <div className="modal-header">
          <h2>Create a new project</h2>
          <p>Organize tasks and collaborate with your team</p>
        </div>

        <form onSubmit={handleCreate} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              className="form-input"
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error === "Project name is required") setError("");
              }}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Describe the project goals and scope"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows="4"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


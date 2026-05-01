import { useState } from "react";
import API from "../api/axios";

export default function AddMemberModal({ projectId, onClose, onAdded }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const normalizedEmail = email.trim().toLowerCase();

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    if (!normalizedEmail) {
      setError("Email is required");
      return;
    }

    if (!normalizedEmail.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      await API.post("/projects/add-member", { projectId, email: normalizedEmail });
      setEmail("");
      onAdded && onAdded();
      onClose && onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal card modal-lg">
        <div className="modal-header">
          <h2>Add team member</h2>
          <p>Invite someone to collaborate on this project</p>
        </div>

        <form onSubmit={handleAdd} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email address *</label>
            <input
              className="form-input"
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              disabled={loading}
              required
              autoFocus
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
              disabled={loading || !normalizedEmail}
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

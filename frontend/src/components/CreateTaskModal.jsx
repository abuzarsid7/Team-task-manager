import { useState } from "react";
import API from "../api/axios";

export default function CreateTaskModal({ projectId, project, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const members = project?.members || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || undefined,
        priority: form.priority,
        projectId,
      };

      if (form.assignedTo) {
        payload.assignedTo = form.assignedTo;
      }

      await API.post("/tasks/create", payload);
      onCreated && onCreated();
      onClose && onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Create task failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal card modal-lg">
        <div className="modal-header">
          <h2>Create task</h2>
          <p>Add a task to this project and assign it to a team member if needed.</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Task title *</label>
            <input
              className="form-input"
              placeholder="Design the login screen"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Add details, acceptance criteria, or notes"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={loading}
              rows="4"
            />
          </div>

          <div className="task-modal-grid">
            <div className="form-group">
              <label className="form-label">Due date</label>
              <input
                className="form-input"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-input"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                disabled={loading}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assign to</label>
            <select
              className="form-input"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              disabled={loading}
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            <div className="form-hint">
              Leave unassigned or choose a team member from this project.
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

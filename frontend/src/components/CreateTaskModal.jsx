import { useState } from "react";
import API from "../api/axios";

export default function CreateTaskModal({ projectId, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/tasks/create", { ...form, projectId });
      setLoading(false);
      onCreated && onCreated();
      onClose();
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Create task failed");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <h3>Create Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input className="form-input" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <textarea className="form-input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <input className="form-input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div className="form-group">
            <select className="form-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="form-group">
            <input className="form-input" placeholder="Assign to (userId)" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

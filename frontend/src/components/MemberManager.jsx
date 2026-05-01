import React, { useState } from "react";
import API from "../api/axios";

export default function MemberManager({ projectId, onUpdated }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!email) return alert("Enter an email");
    setLoading(true);
    try {
      await API.post("/projects/add-member", { projectId, email });
      alert("Member added");
      setEmail("");
      onUpdated && onUpdated();
    } catch (err) {
      alert(err.response?.data?.message || "Add failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!email) return alert("Enter an email");
    if (!confirm(`Remove ${email} from project?`)) return;
    setLoading(true);
    try {
      await API.post("/projects/remove-member", { projectId, email });
      alert("Member removed");
      setEmail("");
      onUpdated && onUpdated();
    } catch (err) {
      alert(err.response?.data?.message || "Remove failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12">
      <h4>Manage Members</h4>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input className="form-input" placeholder="member@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn" onClick={handleAdd} disabled={loading}>{loading ? '...' : 'Add'}</button>
        <button className="btn secondary" onClick={handleRemove} disabled={loading}>{loading ? '...' : 'Remove'}</button>
      </div>
    </div>
  );
}

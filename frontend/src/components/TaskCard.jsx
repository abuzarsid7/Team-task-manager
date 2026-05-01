import React from "react";

const priorityColor = (p) => {
  if (p === "High") return "#ef4444"; // red
  if (p === "Medium") return "#f59e0b"; // amber
  return "#10b981"; // green
};

export default function TaskCard({ task, onChangeStatus }) {
  const statuses = ["To Do", "In Progress", "Done"];
  const idx = statuses.indexOf(task.status);

  return (
    <div className="task-card card" style={{ padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 700 }}>{task.title}</div>
          <div className="muted" style={{ fontSize: 13 }}>{task.description}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, marginBottom: 6 }}>Assigned</div>
          <div style={{ fontWeight: 600 }}>{task.assignedTo?.name || "Unassigned"}</div>
          <div className="muted" style={{ fontSize: 12 }}>{task.assignedTo?.email || ""}</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ background: priorityColor(task.priority), color: "#fff", padding: "4px 8px", borderRadius: 6, fontSize: 12 }}>{task.priority}</div>
          <div className="muted" style={{ fontSize: 12 }}>{task._id}</div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: 'center' }}>
          <label className="muted" style={{ fontSize: 12 }}>Status</label>
          <select
            value={task.status}
            onChange={(e) => onChangeStatus(task._id, e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
